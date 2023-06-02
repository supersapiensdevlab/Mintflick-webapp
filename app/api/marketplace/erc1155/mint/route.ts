import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { Nft } from "@/utils/models/nft.model";

type IData = {
  contract_type: string;
  contract_address: string;
  token_owner: string;
  number_of_tokens: number;
  token_id: number;
  chain: object;
  price: string;
  meta_data_url: string;
  is_in_auction: boolean;
  is_in_sale: boolean;
  meta_data: object;
  createdAt: string;
  updatedAt: string;
};

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    console.log(req);
    const contract_type: string = req.contract_type;
    const contract_address: string = req.contract_address;
    const token_id: number = req.token_id;
    const number_of_tokens: number = req.number_of_tokens;
    const chain: object = req.chain;
    const price: string = "0";
    const meta_data_url: string = req.meta_data_url;
    const is_in_auction: boolean = req.is_in_auction;
    const is_in_sale: boolean = req.is_in_sale;
    const meta_data: object = req.meta_data;
    const token_owner: string = req.token_owner;
    const createdAt: string = req.createdAt;
    const updatedAt: string = req.updatedAt;

    if (
      !contract_type ||
      !contract_address ||
      !token_owner ||
      token_id === undefined ||
      is_in_auction === undefined ||
      is_in_sale === undefined ||
      !chain ||
      !price ||
      !meta_data_url ||
      !meta_data
    ) {
      return NextResponse.json({
        success: false,
        message: "Missing some required parameters in request body",
        data: {},
      });
    }

    const mintData: IData = {
      contract_type: contract_type,
      contract_address: contract_address,
      token_owner: token_owner,
      number_of_tokens: number_of_tokens,
      token_id: token_id,
      chain: chain,
      price: price,
      meta_data_url: meta_data_url,
      is_in_auction: is_in_auction,
      is_in_sale: is_in_sale,
      meta_data: meta_data,
      createdAt: createdAt,
      updatedAt: updatedAt,
    };

    const nft = new Nft(mintData);
    await nft.save();

    return NextResponse.json({
      success: true,
      message: "New Nft added to database",
      data: nft,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: "Error while minting nft",
      data: {},
    });
  }
}
