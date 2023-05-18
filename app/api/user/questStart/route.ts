import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOneAndUpdate } from "@/utils/user/user";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const walletId = req.walletId;
    const questId = req.questId;

    const addQuest = await findOneAndUpdate(
      { wallet_id: walletId },
      { $push: { quests: questId } },
      { upsert: true }
    );
    if (!addQuest.success) {
      return NextResponse.json({ status: "error", message: addQuest.error });
    }
    return NextResponse.json({
      status: "success",
      message: "Quest added successfully",
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
