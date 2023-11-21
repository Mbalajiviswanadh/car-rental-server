// models/Reply.js
const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;
