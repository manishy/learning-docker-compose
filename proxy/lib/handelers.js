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
        res.send("<head><meta http-equiv='refresh' content='4'></head><b>Server Down </br> Waiting to be up ... </b>");
        console.log("Server Down");
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
        res.send("<head><meta http-equiv='refresh' content='4'></head><b>Server Down </br> Waiting to be up ... </b>");
        console.log("Server Down");
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


const handleResponse = function (response, web) {
    response.setEncoding('utf8');
    let rawData = '';
    response.on('data', (chunk) => {
        rawData += chunk;
    });
    response.on('end', () => {
        try {
            const parsedData = JSON.parse(rawData);
            parsedData["DNS"] = web;
            console.log('latest status is \n********', parsedData, '********');
            activeServer = web;
        } catch (err) {
            console.error(err);
        }
    });
}


const updateActiveServer = function () {
    let checkService = function (web, remaining) {
        http.get(`http://${web}:${port}/health`, {timeout: 100},
        (response) => handleResponse(response, web))
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
    checkService(allServers[0], allServers.slice(1));
}


module.exports = {
    getReqPipe,
    postReqPipe,
    logRequest,
    updateActiveServer
};