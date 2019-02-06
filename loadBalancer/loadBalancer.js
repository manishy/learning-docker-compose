const express = require('express');
const request = require('request');
const app=express();
const PORT=8080;
app.listen(PORT);

let count = 0;
const config = require('./balancerConfig.json');
let proxies = config["proxies"];
app.get('*',(req, res)=>{
    let index = count%proxies.length;
    let proxy = proxies[index];
    count++;
    // console.log('------------>',`http://${proxy}${req.url}`);
    console.log('------------>',`proxy is : http://${proxy}${req.url}`);
    console.log('------------>',`request is : ${req.url}`);
    
    request(`http://${proxy}${req.url}`, (error, response, body)=>{
        let statusCode = response && response.statusCode;
        console.log('req is :', req.url);
        console.log('Proxy is :', proxy);
        console.log('error:', error); 
        console.log('statusCode:', statusCode); 
        // console.log('body:', body);
        res.send(body);
    })
})


app.post('*',(req, res)=>{
    let index = count%proxies.length;
    let proxy = proxies[index];
    count++;
    console.log('------------>',`proxy is : http://${proxy}${req.url}`);
    console.log('------------>',`request is : ${req.url}`);
    request.post({url: `http://${proxy}${req.url}`, formData : req.body } ,(error, response, body)=>{
        let statusCode = response && response.statusCode;
        console.log('req is :', req.url);
        console.log('Proxy is :', proxy);
        console.log('error:', error); 
        console.log('statusCode:', statusCode); 
        // console.log('body:', body);
        res.send(body);
    })
})



console.log(`listening at Port${PORT}`);