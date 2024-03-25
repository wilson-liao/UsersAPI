const express = require("express")
const app = express()
const mongoose = require("mongoose")
const User = require("./models/UserModel")

app.use(express.json())

app.get("/", (req, res) => {
    res.send("success!")
})

app.get("/blog", (req, res) => {
    res.send("blog!")
})

app.get("/Users", async(req, res) => {
    try {
        const user = await User.find({});
        res.status(200).json(user)
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get("/Users/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user)
    }
    catch {
        res.status(500).json({message: error.message});
    }
})

app.put("/Users/:id", async(req, res) => {
    try  {
        const {id} = req.params
        const user = await User.findByIdAndUpdate(id, req.body);
        if (!user) {
            return res.status(404).json({message: "user not found"})
        }
        const updatedUser = await User.findById(id)
        res.status(200).json(updatedUser)
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.delete("/Users/:id", async(req, res) => {
    try  {
        const {id} = req.params
        const user = await User.findByIdAndDelete(id, req.body);
        if (!user) {
            return res.status(404).json({message: "user not found"})
        }
        res.status(200).json(user)
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }
})


app.post("/userUpdate", async(req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(200).json(user);
    }
    catch(error) {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
})

mongoose
.connect('mongodb+srv://wilsonliao0212:aaa50507@wilsonapi.9qliqcj.mongodb.net/UsersAPI?retryWrites=true&w=majority&appName=wilsonAPI')
.then( () => {
    console.log("connected")
    app.listen(3000, () => {
        console.log("Node API App is running on port 3000")
    })
    
}).catch((error) => {
    console.log(error)
})