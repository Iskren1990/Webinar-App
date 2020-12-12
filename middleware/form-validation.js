const errors = require("../config/proj-props").errorMsg;
const { objTrimmer } = require("../utils/index");

function loginRegForm(req, res, next) {

    req.body = objTrimmer(req.body);

    const { email, password, firstName, lastName, profilePic, position } = req.body;
    const regex = /[a-z0-9]{3,}/i;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const nameRegex = /^[A-Z][a-z-]*/;
    const urlRegex = /^[http:// | https://]/;
    const positions = [
        "Trainer", "Lecturer", "Executive",
        "Event Manager", "Team Lead",
        "Marketing Manager", "Other", ""
    ];

    if (emailRegex.test(email) === false || regex.test(password) === false) {
        res.locals.error.push(errors.wrongEmail);
        res.locals.error.push(errors.wrongLength("Username and Password", 3));
        res.locals.error.push(errors.wrongChar);
    }

    if (nameRegex.test(firstName) === false || nameRegex.test(lastName) === false) {
        res.locals.error.push(errors.wrongUname);
    }

    if (urlRegex.test(profilePic) === false && profilePic !== "") {
        res.locals.error.push(errors.wrongUrl);
    }

    if (positions.includes(position) === false) {
        res.locals.error.push("Busted !");
    }

    if (res.locals.error.length > 0) {
        res.status(400).json({ message: res.locals.error });
        return;
    }

    next();
}

function createEditForm(req, res, next) {

    req.body = objTrimmer(req.body);
    const { eventName, eventCode, startDate, endDate, eventDescription, eventImage, access } = req.body;
    const nameRegex = /[A-Za-z0-9 ]{1,7}/;
    const urlRegex = /^[http:// | https://]/;
    const dateRegEx = /\d{4}-\d{2}-\d{2}/;

    if (
        nameRegex.test(eventName) === false ||
        nameRegex.test(eventCode) === false ||
        dateRegEx.test(startDate) === false ||
        dateRegEx.test(endDate) === false ||
        eventDescription.length > 10 === false ||
        (eventImage.length > 0 && urlRegex.test(eventImage) === false) ||
        ["Private", "Public"].includes(access) === false
    ) {
        res.locals.error.push("Busted !");
    }

    if (res.locals.error.length > 0) {
        res.status(400).json({ message: res.locals.error });
        return;
    }

    next();
}

module.exports = {
    loginRegForm,
    createEditForm
}


