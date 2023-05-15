import { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface IUser {
  id: String;
  name: String;
  username: String;
  email: String;
  jwt_token: String;
  resetToken: String;
  expireToken: Date;
  wallet_id: String;
  password: String;
  cover_image: String;
  profile_image: String;
  livepeer_data: Object;
  superfan_data: Object;
  tracks: Array<any>;
  videos: Array<any>;
  subscription: Array<any>;
  polls: Array<any>;
  multistream_platform: Array<any>;
  pinned: Array<any>;
  posts: Array<any>;
  events: Array<any>;
  notification: Array<any>;
  oldnotification: Array<any>;
  your_reactions: Array<any>;
  my_playlists: Array<any>;
  reports: Array<any>;
  refer: Object;
  seenIntro: Object;
  gems: Object;
  coins: Object;
  thumbnail: String;
  streamDetails: Object;
  streamSchedule: String;
  streamLinks: Array<any>;
  album_count: Number;
  bio: String;
  followee_count: Array<any>;
  follower_count: Array<any>;
  superfan_to: Array<any>;
  superfan_of: Array<any>;
  favorite_tracks: Array<any>;
  is_mail_verified: Boolean;
  is_verified: Boolean;
  location: String;
  playlist_count: Number;
  repost_count: Number;
  track_count: Number;
  preference: String;
  conversations: Array<any>;
  quests: Array<any>;
}

const userSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 5,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    jwt_token: {
      type: String,
    },
    resetToken: String,
    expireToken: Date,
    wallet_id: { type: String, trim: true, default: null },
    password: {
      type: String,
      default: false,
      required: false,
    },
    cover_image: {
      type: String,
      default: "",
    },
    profile_image: {
      type: String,
      default: "",
    },
    livepeer_data: {
      type: Object,
      required: true,
      default: false,
    },
    superfan_data: {
      type: Object,
      default: false,
    },
    tracks: {
      type: Array,
      default: [],
    },
    videos: {
      type: Array,
      default: [],
    },
    subscription: {
      type: Array,
      default: [],
    },
    polls: {
      type: Array,
      default: [],
    },
    multistream_platform: {
      type: Array,
      default: [],
    },
    pinned: {
      type: Array,
      default: [],
    },
    posts: {
      type: Array,
      default: [],
    },
    events: {
      type: Array,
      default: [],
    },
    notification: {
      type: Array,
      default: [],
    },
    oldnotification: {
      type: Array,
      default: [],
    },
    your_reactions: {
      type: Array,
      default: [],
    },
    my_playlists: {
      type: Array,
      default: [],
    },
    reports: {
      type: Array,
      default: [],
    },
    refer: {
      type: Object,

      default: false,
    },
    seenIntro: {
      type: Object,
      default: {},
    },
    gems: {
      type: Object,
      default: {
        balance: 0,
        history: [],
      },
    },
    coins: {
      type: Object,
      default: {
        balance: 0,
        history: [],
        tasksPerformed: {
          followedTwitter: false,
          followedInstagram: false,
          followedLinkedin: false,
          followedDiscord: false,
          firstPost: false,
          followFive: false,
        },
      },
    },
    thumbnail: { type: String },
    streamDetails: { type: Object, default: {} },
    streamSchedule: {
      type: String,
      default: null,
    },
    streamLinks: { type: Array, default: [] },
    album_count: { type: Number, default: 0 },
    bio: { type: String, default: "", trim: true },
    followee_count: { type: Array, default: [] },
    follower_count: { type: Array, default: [] },
    superfan_to: { type: Array, default: [] },
    superfan_of: { type: Array, default: [] },
    favorite_tracks: { type: Array, default: [] },
    is_mail_verified: { type: Boolean, default: false },
    is_verified: { type: Boolean, default: false },
    location: { type: String, trim: true, default: null },
    playlist_count: { type: Number, default: 0 },
    repost_count: { type: Number, default: 0 },
    track_count: { type: Number, default: 0 },
    preference: {
      type: String,
      required: false,
    },
    conversations: {
      type: Array,
      default: [],
    },
    quests: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAuthToken = async function (res: any) {
  try {
    const token = jwt.sign(
      { _id: this._id.toString() },
      "mynameissahilpunjabicomputerengineer"
    );
    this.jwt_token = token;
    await this.save();
    return token;
  } catch (error) {
    console.log("error is" + error);
    res.send("error is" + error);
  }
};

export const User = models.User || model("User", userSchema);
