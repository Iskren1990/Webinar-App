const mongoose = require("mongoose");

function establishDbConnection(conf) {
    mongoose.connect(
        conf.uri(conf),
        conf.dbOpt,
        (err) => {
            if (err) console.error(`Mongoose connection error: `, err)
            if (!err) console.info(`DB connection established`);
        }
    );
}

module.exports = establishDbConnection;