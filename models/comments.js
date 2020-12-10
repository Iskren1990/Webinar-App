const mongoose = require("mongoose");


const commentsSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    tempId: {
        type: String,
        required: true,
    },
    owner: {
        type: "String",
        required: true,
    },
    replies: [{
        reply: "String",
        date: {
            type: String,
            default: Date.now,
        },
        user: {
            type: String,
            default: "Anonymous"
        },
        comment: {
            type: String,
            required: true,
        }
    }],
    eventId: {
        type: "ObjectId",
        ref: "Events",
        required: true,
    },
    date: {
        type: String,
        default: Date.now,
    }
});

module.exports = mongoose.model("Comments", commentsSchema);