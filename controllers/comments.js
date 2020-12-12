const { Comments } = require("../models/index");
const { errorMsg } = require("../config/proj-props");

const mongoQuery = {
    chosenEv: function (queryParam) { return { eventId: queryParam.toString() } },
    reply: function (toUpdate) { return { $push: { replies: toUpdate } } }
}

const sort = {
    replies: {
        descending: (a, b) => { return +b.date - +a.date },
    },
    comments: {
        descending: (a, b) => { return +b.date - +a.date }
    }
}

const comment = {
    post: async function (req, res, next) {
        try {
            const eventComment = await Comments.create(req.body);
            res.status(201).json(eventComment);
        } catch (err) {
            res.status(424).json({ message: "Comment was not added", err });
        }
    },
    postSocketComment: async function (comment) {
        try {
            return await Comments.create(comment);
        } catch (err) {
            return {err, dbRes, message: "Request unavailable"};
        }
    },
    get: async function (req, res, next) {
        const key = Object.keys(req.query)[0];
        const value = req.query[key];
        try {
            const allComments = await Comments.find(mongoQuery[key](value));
            const commentsSorted = allComments
                .sort(sort.comments.descending)
                .map(comment => {
                    comment.replies.sort(sort.replies.descending);
                    return comment
                });

            res.status(200).json(commentsSorted);
        } catch (err) {
            next(err)
        }
    },
    getAllForOne: async function (eventId) {
        try {
            const allComments = await Comments.find({ eventId });
            const commentsSorted = allComments
                .sort(sort.comments.descending)
                .map(comment => {
                    comment.replies.sort(sort.replies.descending);
                    return comment
                });

            return commentsSorted;
        } catch (err) {
            return "no comments found";
        }
    },
    put: async function (req, res, next) {
        const key = Object.keys(req.query)[0];
        const value = req.query[key];
        try {
            const updateComment = await Comments.findOneAndUpdate({ _id: value }, mongoQuery[key](req.body));
            res.status(200).json(updateComment);
        } catch (err) {
            res.status(424).json({ message: "Failed to modify comment.", err });
        }
    },
    addReply: async function (id, reply) {
        try {
            const dbRes = await Comments.findByIdAndUpdate(id,
                {
                    $push: {
                        replies: {
                            $each: [reply],
                            $position: 0
                        }
                    }
                }, { returnOriginal: false });
            return dbRes;
        } catch (err) {
            return {err, dbRes, message: "Request unavailable"};
        }
    },
    delete: async function (req, res, next) {
        const key = Object.keys(req.query)[0];
        const value = req.query[key];

        try {
            const deleteComment = await Comments.findOneAndDelete({ _id: value });
            res.status(200).json(deleteComment);
        } catch (err) {
            res.status(424).json({ error: "Failed to delete", err });
        }
    },
    deleteOne: async function (commentId) {
        try {
            const deleteComment = await Comments.findOneAndDelete({ _id: commentId });
            return deleteComment;
        } catch (err) {
            return {err, deleteComment, message: "Request unavailable"};
        }
    }
}



module.exports = {
    comment
}