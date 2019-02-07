const filterSelectResult = (response) => {
    return response.command == "SELECT";
};

const add_user = function(req){
    let userName = req.body.username;
    if(!userName){
        console.log("Invalid user name");
        return;
    }
    let client = req.app.client;
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
        console.log('user successfully added');
    });
}

const getUserPromise = function(req){
    let client = req.app.client;
    let query = "SET search_path to sample_user;" +
      "SELECT * FROM users;";
    return client.query(query)
    .then((response)=>{
        let selectQueryResult = response.filter(filterSelectResult);
        let users = selectQueryResult[0].rows;
        return users;
    }).catch((err) => console.log(err));
}


module.exports = {
    add_user,
    getUserPromise
}