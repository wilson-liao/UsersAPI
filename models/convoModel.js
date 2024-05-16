const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  roomId: String,
  messages: [
    {
      sender: {
        senderId: String,
        displayName: String
      },
      messageID: String,
      date: String,
      message: String,
      isRead: Boolean
    }
  ]
});

const conversation = mongoose.model('conversation', conversationSchema);

module.exports = conversation;
