const request = require('request');

let count = 0;
// const config = require('./../balancerConfig.json');
// const webs = config["webs"];
// const port = config["port"];
const log = function (webServer, url, error, statusCode) {
    console.log('------------>', `webServer is : http://${webServer}${url}`);
    console.log('------------>', `request is : ${url}`);
    console.log('req is :', url);
    console.log('webServer is :', webServer);
    console.log('error:', error);
    console.log('statusCode:', statusCode);
}

const getReqPipe = function (req, res) {
    const config = req.app.webConfigs
    // let webs = config["webs"];
    let port = config["port"];
    // let index = count % webs.length;
    // let webServer = webs[index];
    let webServer = req.app.activeServer;
    // count++;
    if(!webServer){
        res.send("server down");
        console.log("server down");
        return;
    }
    // console.log("should not come here");
    
    request(`http://${webServer}:${port}${req.url}`, (error, response, body) => {
        let statusCode = response && response.statusCode;
        log(webServer, req.url, error, statusCode);
        res.send(body);
    })
};

const postReqPipe = function (req, res) {
    // const config = req.app.webConfigs
    // let webs = config["webs"];
    // let port = config["port"];
    // let index = count % webs.length;
    // let webServer = webs[index];
    // count++;
    const config = req.app.webConfigs
    let port = config["port"];
    let webServer = req.app.activeServer;
    request.post(`http://${webServer}:${port}${req.url}`, {
        form: req.body
    }, (error, response, body) => {
        let statusCode = response && response.statusCode;
        log(webServer, req.url, error, statusCode);
        res.send(body);
    });
};

const registerWeb = function (req, res) {
    req.app.webConfigs["webs"].push(req.body.webDns);
    console.log(req.app.webConfigs);
    res.end();
};

const updateActiveServer = function (req, res, next) {
    let allServers = req.app.webConfigs["webs"];
    let port = req.app.webConfigs["port"];

    let checkService = (web, remaining)=> {
        request(`http://${web}:${port}/health`, (error, response, body) => {
            if (error && remaining.length > 0) {
                  checkService(remaining[0], remaining.slice(1));
                  return;
            }
            let statusCode = response && response.statusCode;
            log(web, req.url, error, statusCode);
            console.log("body===============================",body);
            if(body&&body.isAvailable){
            req.app.activeServer = body["DNS"];
            }
            next();
        })
    }
    checkService(allServers[0], allServers.slice(1));
};


module.exports = {
    getReqPipe,
    postReqPipe,
    updateActiveServer,
    registerWeb
};