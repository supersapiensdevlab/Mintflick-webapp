import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOneAndUpdate, findOne } from "@/utils/user/user";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const value: number = req.value;
    const id: string = req.id;
    const { success, user, error } = await findOne({ id: id });
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }
    const updateGems = await findOneAndUpdate(
      { id: user.id },
      {
        $set: { "gems.balance": user.gems.balance + value / 10 },
      },
      {}
    );
    if (!updateGems.success) {
      return NextResponse.json({ status: "error", message: updateGems.error });
    }
    const updateCoins = await findOneAndUpdate(
      { id: user.id },
      {
        $set: { "coins.balance": user.coins.balance - value },
      },
      {}
    );
    if (!updateCoins.success) {
      return NextResponse.json({ status: "error", message: updateCoins.error });
    }
    return NextResponse.json({
      status: "success",
      message: "Treasury converted successfully",
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
