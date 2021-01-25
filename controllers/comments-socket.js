const { comment } = require("./comments");

const room = {}

function socket(io) {

    io.on('connection', async (user) => {
        const userId = user.id;
        let eventId = user.handshake.query.chosen;
        if (room[eventId] === undefined) room[eventId] = { eventId };

        user.join(room[eventId].eventId);

        const allCommentsForOne = await comment.getAllForOne(room[eventId].eventId);

        io.to(userId).emit("allComments", allCommentsForOne);

        //========= WebRTC Signaling Start

        user.on("newUser", (id) => {
            if (!!room[eventId].owner === true) {
                user.to(room[eventId].owner).emit("newUser", id)
            }
        });

        user.on("owner joined", (owner) => {
            room[eventId].owner = owner;
            user.to(room[eventId].eventId).emit("owner joined", owner);
        });

        user.on("request for offer", (joinerId) => {
            user.to(room[eventId].owner).emit("request for offer", joinerId);
        });

        user.on("offer", (payload) => {
            user.to(payload.target).emit("offer", payload);
        });

        user.on("answer", (payload) => {
            io.to(payload.target).emit("answer", payload);
        });

        user.on("ice-candidate", (incoming) => {
            io.to(incoming.target).emit("ice-candidate", incoming);
        });

        //======  Stream Controller Logic

        user.on("stream state change", (streamStateChange) => {
            user.broadcast.to(room[eventId].eventId).emit("stream state change", streamStateChange);
        });

        //======  Comments Logic 

        user.on("comment", async (comme) => {
            const bdRes = await comment.postSocketComment(comme);
            io.to(room[eventId].eventId).emit("message", bdRes);
        });

        user.on("reply", async ({ commentId, reply }) => {
            const dbRes = await comment.addReply(commentId, reply);
            io.to(room[eventId].eventId).emit("reply", dbRes);
        });

        user.on("delete", async ({ commentId }) => {
            const dbRes = await comment.deleteOne(commentId);
            io.to(room[eventId].eventId).emit("delete", dbRes);
        });

        user.on('disconnect', (data) => {
            if (room[eventId].owner === user.id) {
                room[eventId].owner = undefined;
            }
        });
    });
}

module.exports = {
    socket,
}