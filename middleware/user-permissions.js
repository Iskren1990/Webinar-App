const jwt = require("jsonwebtoken");
const { key } = require("../config/variables");

function guestUserStop(req, res, next) {

    if (req.user.isLogged === false) {
        res.status(401).json({message: "You need to be logged in."});
        return;
    }

    next();
}

function loggedUserStop(req, res, next) {

    if (req.user.isLogged === true) {
        res.status(400).json();
        return;
    }

    next();
}

function userStatus(req, res, next) {
    const status = req.cookies.uid;
    if (status === undefined) {
        req.user = { isLogged: false };
    } else {
        req.user = jwt.verify(status, key, (err, suc) => {
            if (err) return { isLogged: false };
			suc.isLogged = true;
            return suc;
        });
    }

    next();
}


module.exports = {
    guestUserStop,
    loggedUserStop,
    userStatus
}