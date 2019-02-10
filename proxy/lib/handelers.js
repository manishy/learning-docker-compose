const fs = require('fs');
const request = require('request');
const http = require('http');

let config = JSON.parse(fs.readFileSync('./config.json'));
const allServices = config["services"];
let activeServer;

const log = function (webService, url, error, statusCode) {
    console.log('------------>', `API is : http://${webService}${url}`);
    console.log('------------>', `request is : ${url}`);
    console.log('req is :', url);
    console.log('service is :', webService);
    console.log('error:', error);
    console.log('statusCode:', statusCode);
};


const logRequest = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

const getReqPipe = function (req, res) {
    if (!activeServer) {
        res.send("<head><meta http-equiv='refresh' content='4'></head><b>Server Down </br> Waiting to be up ... </b>");
        console.log("Server Down");
        return;
    }
    let host = activeServer['host'];
    let port = activeServer['port'];
    request(`http://${host}:${port}${req.url}`, (error, response, body) => {
        let statusCode = response && response.statusCode;
        log(host, req.url, error, statusCode);
        res.send(body);
    })
}

const postReqPipe = function (req, res) {
    if (!activeServer) {
        res.send("<head><meta http-equiv='refresh' content='4'></head><b>Server Down </br> Waiting to be up ... </b>");
        console.log("Server Down");
        return;
    }
    let host = activeServer['host'];
    let port = activeServer['port'];
    request.post(`http://${host}:${port}${req.url}`, {
        form: req.body
    }, (error, response, body) => {
        let statusCode = response && response.statusCode;
        log(activeServer, req.url, error, statusCode);
        res.send(body);
    });
};


const handleResponse = function (response, webConfig) {
    response.setEncoding('utf8');
    let rawData = '';
    response.on('data', (chunk) => {
        rawData += chunk;
    });
    response.on('end', () => {
        try {
            const parsedData = JSON.parse(rawData);
            parsedData["SERVICE"] = webConfig;
            console.log('latest status is \n********', parsedData, '********');
            activeServer = webConfig;
        } catch (err) {
            console.error(err);
        }
    });
}


const updateActiveServer = function () {
    let checkService = function (webConfig, remaining) {
        let web = webConfig['host'];
        let port = webConfig['port'];
        http.get(`http://${web}:${port}/health`, {timeout: 100},
        (response) => handleResponse(response, webConfig))
        .on('error', (err) => {
            console.error(`Got error: ${err}`);
        })
        .on('timeout', () => {
                console.log(`${web} is sleeping`);
                if (remaining.length > 0) {
                    return checkService(remaining[0], remaining.slice(1));
                }
            })
        };
    checkService(allServices[0], allServices.slice(1));
}

const watchFile = function(){
    let fileName = './config.json';
    let watcher = fs.watch(fileName);
    console.log(`watching ${fileName}`);
    config = watcher.on("change", (String, fileName)=>{
        console.log("Change hua ...")
        config = fs.readFile(fileName, 'utf8', (err, content) => {
            if (err) {
                console.log(err);
                return;
            };
            config = JSON.parse(content);
          });
    });
};


module.exports = {
    getReqPipe,
    postReqPipe,
    logRequest,
    updateActiveServer,
    watchFile
};