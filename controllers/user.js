const { User } = require("../models/index");
const createJWT = require("../utils/auth");
const bcrypt = require("bcrypt");
const { errorMsg } = require("../config/proj-props");


const register = {
    post: async function (req, res) {
        const { firstName, lastName, email, password, profilePic, position } = req.body;
        try {
            const suc = await User.create({ firstName, lastName, email, password, profilePic, position });
            const token = createJWT({ id: suc._id, email, isLogged: true });
            res.cookie("uid", token);
            res.status(201).json({ id: suc._id, email, isLogged: true, firstName, lastName, profilePic, position });
        } catch (err) {
            res.locals.error.push(errorMsg.emailUsed);
            res.status(400).json({ message: res.locals.error, err })
        }
    }
}

const login = {
    post: async function (req, res) {
        try {
            const dbRes = await User.findOne({ email: req.body.email });
            const { firstName, lastName, email, id = _id, position, profilePic } = dbRes;
            const isRegistered = bcrypt.compareSync(req.body.password, dbRes.password);

            if (isRegistered === false) { throw new Error(isRegistered) }

            const token = createJWT({ id, email, isLogged: true });
            res.cookie("uid", token);
            res.status(201).json({ firstName, lastName, email, id, position, profilePic });
        } catch (err) {
            res.locals.error.push(errorMsg.wrongCred);
            res.status(400).json({ message: [...res.locals.error], err });
        }
    }
}

const logout = {
    get: function (req, res) {
        res.clearCookie("uid");
        res.status(200).json({ message: "Logged out successfully" });
    }
}

const profile = {
    put: async function (req, res) {
        try {
            const { firstName, lastName, email, id = _id, position, profilePic }
                = await User.findOneAndUpdate({ email: req.user.email }, req.body, { returnOriginal: false });

            res.status(200).json({ firstName, lastName, email, id, position, profilePic });
        } catch (err) {
            res.locals.error.push(errorMsg.wrongCred);
            res.status(404).json({ message: [...res.locals.error], err });
        }
    }
}

module.exports = {
    register,
    login,
    logout,
    profile
}