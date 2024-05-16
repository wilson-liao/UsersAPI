const convo = require("../models/convoModel")


module.exports.convo_post = async (req, res) => {
    const {roomId, messages} = req.body;
    try {
        const convoEntry = await convo.create({roomId, messages})
        res.status(200).json(convoEntry)
    }   
    catch (err) {
        res.status(400).json({error: err});
    }
}

module.exports.convo_put = async (req, res) => {
    const { id } = req.params
    try {
        const convoEntry = await convo.findOneAndUpdate({roomId: id}, req.body);
        res.status(200).json(convoEntry)
    }
    catch (err) {
        res.status(400).json({error: err})
    }
}

module.exports.convo_get = async (req, res) => {
    const { id } = req.params
    const defaultConvo = {
        roomId: id,
        messages: [
          {
            sender: {
              senderId: "",
              displayName: ""
            },
            messageID: "",
            date: "",
            message: "",
            isRead: ""
          }
        ]
    }

    try {
        const convoEntry = await convo.find({roomId: id});
        console.log(convoEntry)
        if (convoEntry.length == 0) {
            res.status(200).json(defaultConvo)
        }
        else {
            res.status(200).json(convoEntry[0])
        }
    }
    catch (err) {
        res.status(400).json({error: err})
    }
}


module.exports.getAllConvo = async (req, res) => {
    const { id } = req.params
    try {
        const convoEntry = await convo.find();
        res.status(200).json(convoEntry)
    }
    catch (err) {
        res.status(400).json({error: err})
    }
}

module.exports.deleteAllConvo = async (req, res) => {
    const { id } = req.params
    try {
        const convoEntry = await convo.deleteMany();
        res.status(200).json(convoEntry)
    }
    catch (err) {
        res.status(400).json({error: err})
    }
}