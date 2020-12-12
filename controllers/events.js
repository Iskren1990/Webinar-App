const { Events } = require("../models/index");
const { errorMsg } = require("../config/proj-props");

// To Do
// separate socket requests from http one

const events = {
    get: async function (req, res, next) {

        const mongoQuery = {
            eventCode: function (v) { return { $and: [{ eventCode: { $regex: v, $options: 'i' } }, { access: "Public" }] } },
            access: function (v) { return { access: "Public" } },
            owner: function (v) { return { owner: String(req.user.id) } },
            chosen: function (v) { return { _id: v } },
        };

        const key = Object.keys(req.query)[0] || "access";
        const value = req.query[key] || "Public";

        try {
            const events = await Events.find(mongoQuery[key](value));
            res.status(200).json(events);
        } catch (err) {
            res.locals.error.push(errorMsg.serverErr);
            res.status(500).json({ message: res.locals.error, err });
        }
    },
    getOne: async function(id) {
        try {
            const event = await Events.findById(id);
            return event;
        } catch (err) {
            return "not found";
        }
    }
}

const create = {
    post: async function (req, res, next) {
        try {
            const created = await Events.create({ ...req.body, owner: req.user.id });
            res.status(201).json(created);
        } catch (err) {
            res.locals.error.push(errorMsg.notUnique("Course name or code"));
            res.status(424).json({ message: "Event was nt created", err });
        }
    }
}

const edit = {
    put: async function (req, res) {
        const eventId = req.query.chosen;
        try {
            const edited = await Events.findOneAndUpdate({ _id: eventId }, { ...req.body });
            res.status(200).json(edited);
        } catch (err) {
            ree = res.locals.error.push(errorMsg.general);
            res.status(424).json({ message: res.locals.error, err });
        }
    },
    updateOne: async function (id, participantId) {
        try {
            const event = await Events.findByIdAndUpdate(id, { $addToSet: { participants: participantId} });
            return event;
        } catch (err) {
            return "not found";
        }
    },
    deleteOne: async function (eventId, userId) {
        try {
            const event = await Events.findByIdAndUpdate(id, { $pull: { participants: participantId} });
        } catch (err) {
            console.log("not found", err);
        }
    }
}

const deleted = {
    delete: async function (req, res) {
        const eventId = req.params.id;
        try {
            const deleted = await Events.findOneAndDelete({ _id: eventId });
            res.status(200).json(deleted);
        } catch (err) {
            res.status(304).json({ message: "Delete Error", err });
        }
    }
}


module.exports = {
    events,
    create,
    edit,
    deleted,
}