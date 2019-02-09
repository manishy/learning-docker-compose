const request = require('request');
const http = require('http');

const config = require('./../balancerConfig.json');
const allServers = config["webs"];
const port = config["port"];
const log = function (webServer, url, error, statusCode) {
    console.log('------------>', `webServer is : http://${webServer}${url}`);
    console.log('------------>', `request is : ${url}`);
    console.log('req is :', url);
    console.log('webServer is :', webServer);
    console.log('error:', error);
    console.log('statusCode:', statusCode);
};


const logRequest = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};



const getReqHandler = function (req, res, webServer) {
    if (!webServer) {
        res.send("server down");
        console.log("server down");
        return;
    }

    request(`http://${webServer}:${port}${req.url}`, (error, response, body) => {
        let statusCode = response && response.statusCode;
        log(webServer, req.url, error, statusCode);
        res.send(body);
    })
}

const getReqPipe = function (req, res) {
    getActiveWeb(req, res, getReqHandler);
}

const postReqHandler = function (req, res, webServer) {
    if (!webServer) {
        res.send("server down");
        console.log("server down");
        return;
    }
    request.post(`http://${webServer}:${port}${req.url}`, {
        form: req.body
    }, (error, response, body) => {
        let statusCode = response && response.statusCode;
        log(webServer, req.url, error, statusCode);
        res.send(body);
    });

}

const postReqPipe = function (req, res) {
    getActiveWeb(req, res, postReqHandler);
};





const getActiveWeb = function (req, res, handler) {
    let checkService = function (web, remaining) {
        http.get(`http://${web}:${port}/health`, {timeout:1000}, (response) => {
            const {statusCode} = response;
            if (statusCode!=200 && remaining.length>0) {
                return checkService(remaining[0], remaining.slice(1));
            }
            response.setEncoding('utf8');
            let rawData = '';
            response.on('data', (chunk) => {
                rawData += chunk;
            });
            response.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    console.log("Status inside getActive web ********",parsedData);
                    handler(req, res, parsedData["DNS"]);
                } catch (e) {
                    console.error(e.message);
                }
            });
        }).on('error', (e) => {
            console.error(`Got error: ${e.message}`);
        }).on('timeout', ()=>{
            console.log(`${web} is sleeping`);
            if(remaining.length>0){
                return checkService(remaining[0], remaining.slice(1));
            }
        })

    };
    checkService(allServers[0], allServers.slice(1));
};


module.exports = {
    getReqPipe,
    postReqPipe,
    logRequest
};