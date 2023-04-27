import {Schema, model } from 'mongoose';

const trendingSchema = new Schema(
  {
    latest_tracks: {
      type: Array,
      default: [],
    },
    latest_videos: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);
export const Trending = model('Trending', trendingSchema);