const user = require("./user");
const events = require("./events");
const comments = require("./comments");

module.exports = {
    ...user,
    ...events,
    ...comments,
}