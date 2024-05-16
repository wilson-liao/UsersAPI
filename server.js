const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")

const http = require('http');
const socketIO = require('socket.io')

const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const convoRoutes = require("./routes/convoRoutes")



app.set("view engine", "ejs");
require('dotenv').config();
const mongoURL = require("./constants.js")


app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));
app.use(cookieParser())

const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: ["http://localhost:8080"],
    },
})

const PORT = 3000;

mongoose
.connect(mongoURL)
.then( () => {
    console.log("connected")
    // Start the server
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.log(error)
})

app.use(authRoutes);
app.use(userRoutes);
app.use(convoRoutes);



// Connect to database then launch app
// mongoose
// .connect(mongoURL)
// .then( () => {
//     console.log("connected")
//     app.listen(3000, () => {
//         console.log("Node API App is running on port 3000")
//     })
    
// }).catch((error) => {
//     console.log(error)
// })


// Socket.io Code
// const message = "hello"

io.on("connection", socket => {
    console.log(socket.id)
    io.emit(socket.id)

    socket.on("send-message", (message, room) => {
        if (room === "") {
            socket.broadcast.emit("receive-message", message)
        }
        else {
            socket.to(room).emit("receive-message", message)
        }
        console.log(message)
    })

    socket.on("join-room", room => {
        socket.join(room)
    })
})
