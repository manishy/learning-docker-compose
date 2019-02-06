const dbHandler = require('./dbHandler.js');

const getUsers = function(req, res){
    let usersPromise = dbHandler.getUserPromise(req);
    usersPromise
    .then((users) => {
      res.json({'users' : users});
    })
    .catch((err) => console.log(err));
};

const logRequest = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};


const addUser = function(req,res){
    dbHandler.add_user(req);
    getUsers(req, res);
    // res.end();
};


module.exports = {
    logRequest,
    addUser,
    getUsers
}