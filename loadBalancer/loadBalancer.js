const express = require('express');
const request = require('request');
const app=express();
const PORT=8080;
app.listen(PORT);

const log = function(webServer, url, error, statusCode){
    console.log('------------>',`webServer is : http://${webServer}${url}`);
    console.log('------------>',`request is : ${url}`);
    console.log('req is :', url);
    console.log('webServer is :', webServer);
    console.log('error:', error); 
    console.log('statusCode:', statusCode);
}

let count = 0;
const config = require('./balancerConfig.json');
const proxies = config["webs"];
const port = config["port"];
app.use(express.urlencoded({extended: true}));
app.get('*',(req, res)=>{
    let index = count%proxies.length;
    let webServer = proxies[index];
    count++;
    request(`http://${webServer}:${port}${req.url}`, (error, response, body)=>{
        let statusCode = response && response.statusCode;
        log(webServer, req.url, error, statusCode);
        res.send(body);
    })
})


app.post('*',(req, res)=>{
    let index = count%proxies.length;
    let webServer = proxies[index];
    count++;
    request.post(`http://${webServer}:${port}${req.url}`, {form : req.body } ,(error, response, body)=>{
        let statusCode = response && response.statusCode;
        log(webServer, req.url, error, statusCode);
        res.send(body);
    })
})



console.log(`listening at Port${PORT}`);