import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { listNft1155 } from "@/utils/marketplace/gamestoweb3/erc1155";

type IData = {
  token_owner: string;
  contract_address: string;
  token_id: number;
  number_of_tokens: number;
  start_date: string;
  end_date: string;
  per_unit_price: number;
  sign: string;
};

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const token_owner: string = req.token_owner;
    const contract_address: string = req.contract_address;
    const token_id: number = req.token_id;
    const number_of_tokens: number = req.number_of_tokens;
    const per_unit_price: number = req.per_unit_price;
    const start_date: string = req.start_date;
    const end_date: string = req.end_date;
    const sign: string = req.sign;

    if (
      !token_owner ||
      !contract_address ||
      !token_id ||
      !per_unit_price ||
      !number_of_tokens ||
      !start_date ||
      !end_date ||
      !sign
    ) {
      return NextResponse.json({
        success: false,
        message: "Error while minting nft",
        data: {},
      });
    }

    const listData: IData = {
      token_owner: token_owner,
      contract_address: contract_address,
      token_id: token_id,
      number_of_tokens: number_of_tokens,
      start_date: start_date,
      end_date: end_date,
      per_unit_price: per_unit_price,
      sign: sign,
    };

    const { success, nftData, error } = await listNft1155(listData);
    if (!success) {
      return NextResponse.json({
        success: false,
        message: error,
        data: {},
      });
    }

    // put logic to save nft to database

    return NextResponse.json({
      success: true,
      message: "Nft listed successfully",
      data: nftData,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: "Error while minting nft",
      data: {},
    });
  }
}
