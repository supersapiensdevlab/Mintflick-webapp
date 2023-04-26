const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

const Trending = mongoose.model('Trending', trendingSchema);
module.exports = Trending;
