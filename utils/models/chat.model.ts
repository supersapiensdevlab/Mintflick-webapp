import {Date, Schema, model} from 'mongoose';

interface IChat{
  user_id: Schema.Types.ObjectId;
  type: string;
  message: string;
  url: string;
  reply_to: Object;
  createdAt: Date;
}

const chatSchema = new Schema<IChat>({
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

interface IRoom {
  room_admin: string;
  room_admin_userid: string;
  users: string[];
  latestMessage: Object;
  chats: IChat[];
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
  users: {
    type: [String],
    default: [],
  },
  latestMessage: {
    type: Object,
  },
  chats: [chatSchema],
});

interface IDM {
  users: string[];
  usernames: string[];
  room_id: string;
  latestMessage: Object;
  chats: IChat[];
}

const dmSchema = new Schema<IDM>({
  users: {
    type: [String],
    required: true,
  },
  usernames: {
    type: [String],
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

export const Chat = model<IChat>('Chat', chatSchema);
export const Room = model<IRoom>('Room', roomSchema);
export const DM = model<IDM>('DM', dmSchema);