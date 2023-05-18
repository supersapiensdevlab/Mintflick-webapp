import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findById, findOneAndUpdate } from "@/utils/user/user";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const preference = req.preference;
    const addPreference = await findOneAndUpdate(
      { _id: req.user_id },
      { $set: { preference: preference } },
      {}
    );
    if (!addPreference.success) {
      return NextResponse.json({
        status: "error",
        message: addPreference.error,
      });
    }
    return NextResponse.json({
      status: "success",
      message: "Prefernce set successfully",
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
