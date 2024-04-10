const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const login = require("./models/loginModel")
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")

app.set("view engine", "ejs");
require('dotenv').config();
const mongoURL = require("./constants.js")


app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));
app.use(cookieParser())



// Connect to database then launch app
mongoose
.connect(mongoURL)
.then( () => {
    console.log("connected")
    app.listen(3000, () => {
        console.log("Node API App is running on port 3000")
    })
    
}).catch((error) => {
    console.log(error)
})

app.use(authRoutes);
app.use(userRoutes);

