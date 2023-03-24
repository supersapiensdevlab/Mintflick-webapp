const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: true,
    default: "text",
  },
  message: {
    type: String,
  },
  url: {
    type: String,
  },
  reply_to: {
    type: Object,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

const roomSchema = Schema({
  room_admin: {
    type: String,
    unique: true,
    required: true,
  },
  room_admin_userid: {
    type: String,
    unique: true,
  },
  chats: [chatSchema],
});

const dmSchema = Schema({
  users: {
    type: Array,
    required: true,
  },
  room_id: {
    type: String,
  },
  chats: [chatSchema],
});

const Room = mongoose.model("Room", roomSchema);
const DM = mongoose.model("DM", dmSchema);

module.exports = { Room, DM };