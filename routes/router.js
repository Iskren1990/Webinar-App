const { loggedUserStop, guestUserStop, loginRegForm, createEditForm } = require("../middleware/index");
const { register, login, logout, profile, events, create, edit, deleted, comment } = require("../controllers/index");

module.exports = (app) => {

    app.get("/", (req, res) => { 
        (req, res ,next) => { console.log(req); next()},
        res.sendFile("../public/dist/Events/index.html", (err) => {res.json(err);});
    });

    app.post("/api/users/register", loggedUserStop, loginRegForm, register.post);
    app.post("/api/users/login", loggedUserStop, login.post);
    app.put("/api/users/profile", guestUserStop, profile.put);
    app.get("/api/users/logout", logout.get);

    app.post("/api/events/create", guestUserStop, createEditForm, create.post);
    app.get("/api/events/public", events.get);
    app.put("/api/events/edit", guestUserStop, createEditForm, edit.put);
    app.delete("/api/events/delete/:id", guestUserStop, deleted.delete);

    app.get("/api/events/comments", comment.get);
    app.post("/api/events/comments", comment.post);
    app.put("/api/events/comments", comment.put);
    app.delete("/api/events/comments", comment.delete);

    app.all("*", (req, res) => {console.log(req.url),res.status(404).json({message: "Page not Found"})});
}