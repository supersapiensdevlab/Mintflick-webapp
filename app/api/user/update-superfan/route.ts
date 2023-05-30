import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOneAndUpdate } from "@/utils/user/user";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const username = req.username;
    const planData = req.planData;
    const update = await findOneAndUpdate(
      { username: username },
      { $set: { superfan_data: planData } },
      { upsert: true }
    );
    if (!update.success) {
      return NextResponse.json({ status: "error", message: update.error });
    }

    return NextResponse.json({
      status: "success",
      message: "user superfan plans updated successfully",
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
