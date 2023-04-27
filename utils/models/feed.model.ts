import { Schema, model } from 'mongoose';

interface IFeed {
  username: string;
  name: string;
  profile_image: string;
  superfan_data: Object;
  content: Object;
  content_type: string;
  reports: Array<string>;
  superfan_to: Array<string>;
  user_id: string;
  wallet_id: string;
}
0
const feedSchema = new Schema<IFeed>({
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
    type: [String],
  },
  superfan_to: {
    type: [String],
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

export const Feed = model<IFeed>('Feed', feedSchema);
