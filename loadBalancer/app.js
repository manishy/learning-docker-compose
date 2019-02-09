const express = require('express');
const app=express();
const handelers = require('./lib/handelers');

app.initialize = function() {
  app.activeServer = "web1";
  app.webConfigs = {
    "webs":[],
    "port": 8000
  }
};


app.use(express.urlencoded({extended: true}));
app.use(handelers.logRequest);

app.get('*',handelers.getReqPipe);
app.post('*',handelers.postReqPipe);

module.exports = app;