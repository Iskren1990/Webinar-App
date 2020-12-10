require("dotenv").config({ path: "./config/.env" });
require("./utils/index").time();

const { globalErrorHandler } = require("./utils/index");
const config = require("./config/variables");
const app = require("express")();

require("./config/db-connection")(config);
require("./config/express")(app, config);
require("./config/app")(app);
require("./routes/router")(app);

app.use(globalErrorHandler);

app.listen(config.PORT, (err) => {
    if (err) console.error("Something went wrong with the server");
    if (!err) setTimeout(() => {
        console.info("Server is running.");
        console.info("Open app on:");
        console.info("\033[35mhttp://localhost:" + config.PORT);
    }, 800);
});