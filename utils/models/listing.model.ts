import { Schema, model, models } from "mongoose";

interface IListing {
  owner: string;
  minter: string;
  token_id: string;
  price: number;
  quantity: number;
  chain_id: number;
}

const listingSchema = new Schema<IListing>({
  owner: {
    type: String,
    required: true,
  },
  minter: {
    type: String,
    trim: true,
  },
  token_id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 5,
  },
  price: { type: Number, default: 0 },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  chain_id: { type: Number, default: 0 },
});

export const Listing =
  models.Listing || model<IListing>("Listing", listingSchema);
