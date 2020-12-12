const { comment } = require("./comments");

function socket (io) {

    io.on('connection', async (user) => {
        
        const userId = user.id;
        const eventId = user.handshake.query.chosen;
        // console.log("connected ", userId); //// Dev pourposses only
        const allCommentsForOne = await comment.getAllForOne(eventId); 
        io.to(userId).emit("allComments", allCommentsForOne);
        
        user.join(eventId);

        user.on("comment", async (comme) => {
            const bdRes = await comment.postSocketComment(comme);
            io.to(eventId).emit("message", bdRes);
        });

        user.on("reply", async ({commentId, reply}) => {
            const dbRes = await comment.addReply(commentId, reply);
            io.to(eventId).emit("reply", dbRes);
        });

        user.on("delete", async ({commentId}) => {
            const dbRes = await comment.deleteOne(commentId);  
            io.to(eventId).emit("delete", dbRes);
        });

        user.on('disconnect', (data) => { 
            // socket auto removed from everywhere
         });
    });
}

module.exports = {
    socket,
}