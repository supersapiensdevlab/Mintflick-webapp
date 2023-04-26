import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const chatSchema = Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    required: true,
    default: 'text',
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
  users: {
    type: Array,
    default: [],
  },
  latestMessage: {
    type: Object,
  },
  chats: [chatSchema],
});

const dmSchema = Schema({
  users: {
    type: Array,
    required: true,
  },
  usernames: {
    type: Array,
    required: true,
  },
  room_id: {
    type: String,
  },
  latestMessage: {
    type: Object,
  },
  chats: [chatSchema],
});
