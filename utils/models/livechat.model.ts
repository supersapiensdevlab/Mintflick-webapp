import { Schema, model } from 'mongoose';

const chatSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
  },
  profile_image: {
    type: String,
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
  value: {
    type: Number,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

interface IRoom {
  room_admin: string;
  room_admin_userid: string;
  chats: Object[];

}

const roomSchema = new Schema<IRoom>({
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

export const Room = model<IRoom>('Room', roomSchema);
