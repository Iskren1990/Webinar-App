module.exports = {
        // for legacy purpose
    titles: {
        "": "Home Page",
        "home": "Home Page",
        "login": "Login Page",
        "register": "Register Page",
        "profile": "Profile Page",
        "create": "Create Course Page",
        "details": "Details Course Page",
        "edit": "Edit Course Page",
        "404": "Page Not Found"
    },
    errorMsg: {
        wrongUname: "Incorrect username or password.",
        wrongEmail: "Incorrect email or password.",
        wrongLength: (field="Field",limit="the minimum") => `${field} should be more than ${limit} characters.`,
        wrongChar: "Latin characters and numbers.",
        notEqualPass: "Both passwords must match",
        emptyField: "Name, Price and ImageUrl are required.",
        emailUsed: "Email is already taken, please use another",
        unameUsed: "Username is already taken, please use another",
        wrongCred: "Wrong credentials",
        notNumber: "Price should be a number",
        notUnique: (name="ID") => `${name} should be unique`,
        general: "Something went wrong, please excuse us and try again",
        wrongUrl: "Image url is required and should point to actual image",
        serverErr: "It’s not you. It’s us. Give it another try, please.",
    },

    views: {
        "/": "home",
        "/home": "home",
        "/register": "register",
        "/login": "login",
        "/create": "create-edit",
        "/edit": "create-edit",
    }
}