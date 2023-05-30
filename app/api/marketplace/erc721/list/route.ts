import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { listNft } from "@/utils/marketplace/gamestoweb3/erc721";

type IData = {
  token_owner: string;
  contract_address: string;
  token_id: number;
  price: string;
  start_date: string;
  end_date: string;
  sign: string;
};

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const token_owner: string = req.token_owner;
    const contract_address: string = req.contract_address;
    const token_id: number = req.token_id;
    const price: string = req.price;
    const start_date: string = req.start_date;
    const end_date: string = req.end_date;
    const sign: string = req.sign;

    if (
      !token_owner ||
      !contract_address ||
      !token_id ||
      !price ||
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
      price: price,
      start_date: start_date,
      end_date: end_date,
      sign: sign,
    };

    const { success, nftData, error } = await listNft(listData);
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
