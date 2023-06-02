import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import {
  findByIdAndUpdate,
  findOne,
  findOneAndUpdate,
} from "@/utils/user/user";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const evm_wallet_id: string = req.evmWalletId;
    const solana_wallet_id: string = req.solanaWalletId;

    if (!evm_wallet_id || !solana_wallet_id) {
      return NextResponse.json({
        status: "error",
        message: "Missing solana or evm wallet id in request body",
      });
    }
    const addSolanaWallet = await findOneAndUpdate(
      {
        evm_wallet_id: evm_wallet_id,
      },
      { $set: { wallet_id: solana_wallet_id } },
      {}
    );
    if (!addSolanaWallet.success) {
      return NextResponse.json({
        status: "error",
        message: addSolanaWallet.error,
      });
    }
    return NextResponse.json({
      status: "success",
      message: "Solana wallet added successfully",
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err, data: {} });
  }
}
