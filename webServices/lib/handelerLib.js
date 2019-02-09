const dbHandler = require('./dbHandler.js');
const request = require("request");

const registerAsWeb = function () {
    request.post(`http://${process.env.PROXY_URL}/registerWeb`, {
        form: {
            "webDns": `${process.env.WEB_DNS}`
        }
    }, (error, response, body) => {
        if (error) {
            console.log("fat gya", error);
            return;
        }
        console.log("Web registered succefully");
        // response.send(body);
    })
};

const updateAvailability = function (req, flag) {
    req.app.isAvailable = flag;
};

const getUsers = function (req, res) {
    // updateAvailability(req, false);
    let usersPromise = dbHandler.getUserPromise(req);
    usersPromise
        .then((users) => {
            res.json({
                'users': users
            });
            updateAvailability(req, true);
        })
        .catch((err) => console.log(err));
};

const logRequest = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};


const addUser = function (req, res) {
    updateAvailability(req, false);
    dbHandler.add_user(req);
    getUsers(req, res);
};

const sleep = function (req, res) {
    updateAvailability(req, false);
    let startTime = new Date().getTime();
    let currentTime = new Date().getTime();
    const timeDiff = currentTime - startTime;
    while (timeDiff != 50000) {
        currentTime = new Date().getTime()
    }
    updateAvailability(req, true);
    res.end();
};

const getAvailability = function (req, res) { ////   todo
    let isAvailable = req.app.isAvailable;
    res.json({
        "isAvailable": isAvailable,
        "DNS": `${process.env.WEB_DNS}`
    });
}

module.exports = {
    logRequest,
    addUser,
    getUsers,
    sleep,
    getAvailability,
    registerAsWeb
}