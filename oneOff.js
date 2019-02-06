const {Client} = require('pg');

const defaultCs = `postgres://localhost:5432/postgres`;
const connectionString = process.env.DATABASE_URL||defaultCs;
const client = new Client(connectionString)
client.connect()
const initialize_db =()=>{
    client.query("CREATE SCHEMA IF NOT EXISTS sample_user;" +
    "SET search_path to sample_user;" 
    +"create table if not exists users(user_name varchar(200));",(err,res)=>{
        if(err){
            console.log(err);
            client.end()
            return
        }
        console.log('Table successfully created');
        client.end()
    })
}

initialize_db();
