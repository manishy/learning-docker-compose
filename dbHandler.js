const {Client} = require('pg');

const defaultCs = `postgres://localhost:5432/postgres`;
const connectionString = process.env.DATABASE_URL||defaultCs;
const client = new Client(connectionString)
client.connect()

// initialize_db();
const add_user = function(userName){
    client.query("SET search_path to sample_user;");
    const insertQuery = {
        text:"INSERT INTO users VALUES($1);",
        values: [userName]
        }
    client.query(insertQuery,(err,res)=>{
        if(err){
            console.log(err);
            return;
        }
        console.log('user successfully created');
    });
}
module.exports = {
    add_user
}

