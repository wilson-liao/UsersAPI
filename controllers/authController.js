const login = require("../models/loginModel")
const jwt = require("jsonwebtoken")

const handleErrors = (err) => {
    console.log(err)
    let errors = {email: "", password: ""};

    if (err.message === "Incorrect Email") {
        errors.email = "Email has not been registered"
    }

    if (err.message === "Incorrect Password") {
        errors.password = "Incorrect Password"
    }

    if (err.code === 11000) {
        errors.email = "Email account already exists";
        return errors;
    }

    if (err.message.includes("login validation failed")) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'secret', {
        expiresIn: maxAge
    })
}

module.exports.signup_get = (req, res) => {
    res.send('signup')
}
module.exports.login_get = (req, res) => {
    res.send('login')
    console.log('req')
}
module.exports.signup_post = async (req, res) => {
    const {email, password} = req.body;
    // console.log("registering with email " + email + " and password " + password)
    try {
        const loginEntry = await login.create({email, password});
        const token = createToken(loginEntry._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).send(loginEntry._id)
    }
    catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({errors})
    }
}
module.exports.login_post = async (req, res) => {
    const {email, password} = req.body;

    try {
        const loginEntry = await login.logUserIn(email, password);
        const token = createToken(loginEntry._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json(loginEntry)
    }   
    catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({"error": errors});
    }
}

module.exports.delete_get = async (req, res) => {
    try  {
        const log = await login.deleteMany({});
        if (!log) {
            return res.status(404).json({message: "log not found"})
        }
        res.status(200).json(log)
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports.logout_get = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).json("logged out")
}

module.exports.update_put = async(req, res) => {
    try  {
        const {id} = req.params
        const entry = await login.findByIdAndUpdate(id, req.body);
        if (!entry) {
            return res.status(404).json({message: "entry not found"})
        }
        const updatedEntry = await login.findById(id)
        res.status(200).json(updatedEntry._id)
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports.getall = async(req, res) => {

    try {
        const entries = await login.find({});
        res.status(200).json(entries)
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }
}