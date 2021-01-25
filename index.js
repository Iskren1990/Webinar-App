require("dotenv").config({ path: "./config/.env" });
require("./utils/index").time();
const { globalErrorHandler } = require("./utils/index");

const config = require("./config/variables");
const app = require("express")();

const socketio = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = socketio(server, { cors: config.cors });
const {socket} = require('./controllers/index');

require("./config/db-connection")(config);
require("./config/express")(app, config);
require("./config/app")(app);
require("./routes/router")(app);

socket(io);


app.use(globalErrorHandler);

server.listen(config.PORT, (err) => {
    if (err) console.error("Something went wrong with the server");
    if (!err) setTimeout(() => {
        console.info("Server is running.");
        console.info("Open app on:");
        console.info("\033[35mhttps://dodo-hosting.herokuapp.com:" + config.PORT);
    }, 800);
});