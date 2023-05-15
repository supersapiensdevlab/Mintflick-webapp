import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findById, findOneAndUpdate } from "@/utils/user/user";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const value = req.value;
    const user = await findById(req.user_id);
    console.log(user.username);

    await findOneAndUpdate(
      { id: user.id },
      {
        $set: { "gems.balance": user.gems.balance + value / 10 },
      },
      {}
    );

    await findOneAndUpdate(
      { id: user.id },
      {
        $set: { "coins.balance": user.coins.balance - value },
      },
      {}
    );
    return NextResponse.json({ status: "success" });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
