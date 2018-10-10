const express = require('express');
const network = require('network');
const app=express();
const PORT=8000;
app.use(express.json());
app.listen(PORT);
let content = "<h1>HELLO WORLD<h1>"

app.get('/',(req,res)=>{
    res.send(content);
});
app.get('/nextPage',(req,res)=>{
    res.send("<h1>HELLO WORLD IN DIFF PAGE<h1>");
})
app.get('/ip',(req,res)=>{
    network.get_active_interface((err,obj)=>res.send(obj["ip_address"]))
})

console.log(`listening at Port${PORT}`);