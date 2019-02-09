const dbHandler = require('./dbHandler.js');

const getUsers = function (req, res) {
    let usersPromise = dbHandler.getUserPromise(req);
    usersPromise
        .then((users) => {
            res.json({
                'users': users
            });
        })
        .catch((err) => console.log(err));
};

const logRequest = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};


const addUser = function (req, res) {
    dbHandler.add_user(req);
    getUsers(req, res);
};

const sleep = function (req, res) {
    let startTime = new Date().getTime();
    let currentTime = new Date().getTime();
    const timeDiff = currentTime - startTime;
    while (timeDiff != 50000) {
        currentTime = new Date().getTime()
    }
    res.end();
};

const getAvailability = function (req, res) {
    res.json({
        "statusCode": 200,
        "DNS": `${process.env.WEB_DNS}`
    });
}

module.exports = {
    logRequest,
    addUser,
    getUsers,
    sleep,
    getAvailability
}