import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { mintNft1155 } from "@/utils/marketplace/gamestoweb3/erc1155";

type IData = {
  wallet_address: string;
  contract_address: string;
  token_owner: string;
  token_id: number;
  number_of_tokens: number;
  image_uri: string;
  name: string;
  description: string;
  attributes: Array<object>;
  external_uri: string;
};

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const wallet_address: string = req.wallet_address;
    const contract_address: string = req.contract_address;
    const token_owner: string = req.token_owner;
    const token_id: number = req.token_id;
    const number_of_tokens: number = req.number_of_tokens;
    const image_uri: string = req.image_uri;
    const name: string = req.name;
    const description: string = req.description;
    const attributes: Array<object> = req.attributes;
    const external_uri: string = req.external_uri;

    if (
      !wallet_address ||
      !contract_address ||
      !token_owner ||
      !token_id ||
      !number_of_tokens ||
      !image_uri ||
      !name ||
      !description ||
      !attributes ||
      !external_uri
    ) {
      return NextResponse.json({
        success: false,
        message: "Error while minting nft",
        data: {},
      });
    }

    const mintData: IData = {
      wallet_address: wallet_address,
      contract_address: contract_address,
      token_owner: token_owner,
      token_id: token_id,
      number_of_tokens: number_of_tokens,
      image_uri: image_uri,
      name: name,
      description: description,
      attributes: attributes,
      external_uri: external_uri,
    };

    const { success, nftData, error } = await mintNft1155(mintData);
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
      message: "Nft minted successfully",
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
