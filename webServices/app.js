const express = require("express");
const app = express();
const handelerLib = require('./lib/handelerLib.js');

app.initialize = function(client) {
  app.client = client;
};

app.use(express.urlencoded({extended: true}));
app.use(handelerLib.logRequest);

app.post('/add_user',handelerLib.addUser);

app.get('/users',handelerLib.getUsers);
app.get('/sleep',handelerLib.sleep);
app.get('/health',handelerLib.getHealthStatus);


app.use(express.static('public'));


module.exports = app;
