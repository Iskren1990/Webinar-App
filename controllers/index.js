const user = require("./user");
const events = require("./events");
const comments = require("./comments");
const socket = require("./comments-socket");

module.exports = {
    ...user,
    ...events,
    ...comments,
    ...socket,
}