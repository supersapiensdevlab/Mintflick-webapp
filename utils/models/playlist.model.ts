import { Schema, model } from "mongoose";

interface IPlaylist {
  artwork: string;
  description: string;
  id: string;
  is_album: boolean;
  playlist_name: string;
  repost_count: number;
  favorite_count: number;
  total_play_count: number;
}

const playlistSchema = new Schema<IPlaylist>(
  {
    artwork: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },
    description: {
      type: String,
      trim: true,
    },
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 5,
    },
    is_album: { type: Boolean, default: false },
    playlist_name: {
      type: String,
      required: true,
      trim: true,
    },
    repost_count: { type: Number, default: 0 },
    favorite_count: { type: Number, default: 0 },
    total_play_count: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const Playlist = model<IPlaylist>("Playlist", playlistSchema);