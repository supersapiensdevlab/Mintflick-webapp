import { Schema, model, models } from "mongoose";

// type chainData = {
//   id: number;
//   name: string;
// };

// type metadata = {
//   name: string;
//   image: string;
//   description: string;
//   external_uri: string;
//   attributes: object;
// };

interface IMint {
  contract_address: string;
  contract_type: string;
  token_id: number;
  number_of_tokens: number;
  chain: object;
  price: string;
  meta_data_url: string;
  is_in_auction: boolean;
  is_in_sale: boolean;
  token_owner: string;
  meta_data: object;
  createdAt: string;
  updatedAt: string;
}

const mintSchema = new Schema<IMint>({
  contract_address: {
    type: String,
    required: true,
  },
  contract_type: {
    type: String,
  },
  token_id: {
    type: Number,
    required: true,
    unique: true,
  },
  chain: { type: Object, required: true },
  price: { type: String },
  meta_data_url: { type: String },
  is_in_auction: { type: Boolean },
  is_in_sale: { type: Boolean },
  token_owner: { type: String },
  meta_data: { type: Object },
  number_of_tokens: { type: Number },
  createdAt: { type: String },
  updatedAt: { type: String },
});

export const Nft = models.Nft || model<IMint>("Nft", mintSchema);
