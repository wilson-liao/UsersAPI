const User = require("../models/userModel")

module.exports.postUser = async(req, res) => {
    var imgPath = req.body.img

    var obj = {
        name: req.body.name,
        bio: req.body.bio,
        img: imgPath
    }
    const newUser = await User.create(obj)
    if (newUser) {
        res.status(200).send(newUser._id);
    }
    else {
        res.status(500).json({message: error.message})
    }
}

module.exports.getAllUsers = async(req, res) => {
    try {
        const user = await User.find({});
        res.status(200).json(user)
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }
}
module.exports.deleteAllUsers = async(req, res) => {
    try  {
        const user = await User.deleteMany({});
        if (!user) {
            return res.status(404).json({message: "user not found"})
        }
        res.status(200).json(user)
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports.getUserbyId = async(req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user)
    }
    catch {
        res.status(500).json({message: error.message});
    }
}
module.exports.putUser = async(req, res) => {
    try  {
        const {id} = req.params
        console.log("put request with id " + id)
        const user = await User.findByIdAndUpdate(id, req.body);
        if (!user) {
            return res.status(404).json({message: "user not found"})
        }
        const updatedUser = await User.findById(id)
        res.status(200).json(updatedUser._id)
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports.deleteUserById = async(req, res) => {
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
}

module.exports.postFriendRequest = async (req, res) => {
    const {targetId, senderId} = req.body
    console.log(targetId)
    console.log(senderId)
    try {
        const target = await User.findById(targetId)
        const frlist = target.friendRequests
        const fflist = target.friends
        if ((!frlist.includes(senderId)) && (senderId != targetId) && (!fflist.includes(senderId))) {
            frlist.push(senderId)
            const updatedTarget = await User.findByIdAndUpdate(targetId, {friendRequests: frlist}
                , {new: true})
            res.status(200).json({updatedTarget})
        }
        else {
            res.status(200).json({res: "Invalid Friend Request"})
        }
    }
    catch (err) {
        console.log(err)
        res.status(400).json({error: err})
    }
}

module.exports.cancelFriendRequest = async (req, res) => {
    const {targetId, senderId} = req.body
    try {
        const friend = await User.findById(targetId)
        const ffrlist = friend.friendRequests
        removeItem(ffrlist, senderId)
        const updatedFriend = await User.findByIdAndUpdate(targetId, {friendRequests: ffrlist}, {new: true})
        res.status(200).json(updatedFriend)
    }
    catch (error) {
        res.status(400).json({error: error})
    }
}

module.exports.acceptFriendRequest = async (req, res) => {
    const { targetId, senderId } = req.body
    try {
        const friend = await User.findById(targetId)
        const selfUser = await User.findById(senderId)
        const fflist = friend.friends
        const selfflist = selfUser.friends
        const selfFRList = selfUser.friendRequests
        fflist.push(senderId)
        selfflist.push(targetId)
        removeItem(selfFRList, targetId)
        const updatedFriend = await User.findByIdAndUpdate(targetId, {friends: fflist}, {new: true})
        const updatedSelf = await User.findByIdAndUpdate(senderId, {friends: selfflist, friendRequests: selfFRList}, {new: true})
        res.status(200).json(updatedSelf)
    }
    catch (err) {
        res.status(400).json({error: err})
    }
}

module.exports.rejectFriendRequest = async (req, res) => {
    const { targetId, senderId } = req.body
    try {
        const selfUser = await User.findById(senderId)
        const selfFRList = selfUser.friendRequests
        removeItem(selfFRList, targetId)
        console.log(targetId)
        console.log(selfFRList)
        const updatedSelf = await User.findByIdAndUpdate(senderId, {friendRequests: selfFRList}, {new: true})
        res.status(200).json(updatedSelf)
    }
    catch (err) {
        res.status(400).json({error: err})
    }
}

module.exports.removeFriend = async (req, res) => {
    console.log("remove friend")
    const { targetId, senderId} = req.body
    try {
        const sender = await User.findById(senderId)
        const target = await User.findById(targetId)
        const senderflist = sender.friends
        const targetflist = target.friends
        console.log(sender)
        removeItem(senderflist, targetId)
        removeItem(targetflist, senderId)
        console.log(senderflist)
        const updatedSender = await User.findByIdAndUpdate(senderId, {friends: senderflist}, {new: true})
        const updatedTarget = await User.findByIdAndUpdate(targetId, {friends: targetflist}, {new: true})
        res.status(200).json("Successfully Removed Friend")
    }
    catch (err) {
        res.status(400).json({error: err})
    }
}

module.exports.getFriendsList = async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findById(id)
        const friendsList = []
        for (const friendId of user.friends) {
            const friend = await User.findById(friendId)
            friendsList.push(friend)
        }    
        res.status(200).json(friendsList)
    }
    catch (err) {
        console.log(err)
        res.status(400).json({error: err})
    }
}


//Conversations
module.exports.storeRoomId = async (req, res) => {
    const { roomId, senderId, targetId } = req.body
    try {
        const sender = await User.findById(senderId)
        const target = await User.findById(targetId)
        const sc = sender.convoEntries
        const tc = target.convoEntries
        sc.push({friendId: [targetId], roomId: roomId})
        tc.push({friendId: [senderId], roomId: roomId})
        const updatedSender = await User.findByIdAndUpdate(senderId, {convoEntries: sc}, {new: true})
        const updatedTarget = await User.findByIdAndUpdate(targetId, {convoEntries: tc}, {new: true})
        res.status(200).json([updatedSender, updatedTarget])
    }
    catch (error) {
        res.status(400).json({error})
    }
}




function removeItem(arr, value) {
    const index = arr.indexOf(value);
    
    if (index > -1) {
      arr.splice(index, 1);
    }
    
    return arr;
  }