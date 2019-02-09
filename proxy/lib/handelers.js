const request = require('request');
const http = require('http');

const config = require('./../proxy.json');
const allServers = config["webs"];
const port = config["port"];
let activeServer = "";

const log = function (webServer, url, error, statusCode) {
    console.log('------------>', `webService is : http://${webServer}${url}`);
    console.log('------------>', `request is : ${url}`);
    console.log('req is :', url);
    console.log('service is :', webServer);
    console.log('error:', error);
    console.log('statusCode:', statusCode);
};


const logRequest = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

const getReqPipe = function (req, res) {
    if (!activeServer) {
        res.send("server down");
        console.log("server down");
        return;
    }

    request(`http://${activeServer}:${port}${req.url}`, (error, response, body) => {
        let statusCode = response && response.statusCode;
        log(activeServer, req.url, error, statusCode);
        res.send(body);
    })
}


const postReqPipe = function (req, res) {
    if (!activeServer) {
        res.send("server down");
        console.log("server down");
        return;
    }
    request.post(`http://${activeServer}:${port}${req.url}`, {
        form: req.body
    }, (error, response, body) => {
        let statusCode = response && response.statusCode;
        log(activeServer, req.url, error, statusCode);
        res.send(body);
    });
};


const handleResponse = function(response){
    response.setEncoding('utf8');
    let rawData = '';
    response.on('data', (chunk) => {
        rawData += chunk;
    });
    response.on('end', () => {
        try {
            const parsedData = JSON.parse(rawData);
            console.log('latest status is \n********', parsedData , '********');
            activeServer = parsedData['DNS'];
        } catch (e) {
            console.error(e);
        }
    });
}


const updateActiveServer = function(){
    let checkService = function (web, remaining) {
        http.get(`http://${web}:${port}/health`, {timeout:100}, handleResponse).on('error', (err) => {
            console.error(`Got error: ${err}`);
        }).on('timeout', ()=>{
            console.log(`${web} is sleeping`);
            if(remaining.length>0){
                return checkService(remaining[0], remaining.slice(1));
            }
        })

    };
    checkService(allServers[0], allServers.slice(1));
}


module.exports = {
    getReqPipe,
    postReqPipe,
    logRequest,
    updateActiveServer
};