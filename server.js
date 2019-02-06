const fs = require("fs");
const app = require("./app.js");
const PORT = process.env.PORT || 8000;
const defaultCs = 'postgres://localhost:5432/manishy';
const connectionString = process.env.DATABASE_URL||defaultCs;
const {Client} = require('pg');

const client = new Client(connectionString);
client.connect();
app.initialize(client, fs);
app.listen(PORT);

console.log(`listening at Port${PORT}`);
