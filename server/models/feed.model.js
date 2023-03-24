const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedSchema = new Schema({
  username: {
    type: String,
  },
  name: {
    type: String,
  },
  profile_image: {
    type: String,
  },
  superfan_data: {
    type: Object,
  },
  content: {
    type: Object,
  },
  content_type: {
    type: String,
  },
  reports: {
    type: Array,
  },
  superfan_to: {
    type: Array,
  },
  user_id: {
    type: String,
    required: true,
  },
  wallet_id: {
    type: String,
    trim: true,
    default: null,
  },
  
} ,{ timestamps: true });

const Feed = mongoose.model('Feed', feedSchema);
module.exports = Feed;
