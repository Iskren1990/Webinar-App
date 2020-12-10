const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: "https://i.nextmedia.com.au/Utils/ImageResizer.ashx?n=https%3a%2f%2fi.nextmedia.com.au%2fNews%2f20190710104313_dodo.png"
    },
    position: {
        type: String,
        default: "Other"
    }
});

userSchema.pre("save", async function () {
    this.password = await bcrypt.hashSync(this.password, 10);
});

module.exports = mongoose.model("User", userSchema);