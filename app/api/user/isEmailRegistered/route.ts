import { conn } from "@/services/mongo.service";
import { findOne } from "@/utils/user/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const { email } = req;
    const isRegistered = await findOne({ email: email });
    if (isRegistered) {
      return NextResponse.json({
        status: "success",
        data: true,
      });
    } else {
      return NextResponse.json({
        status: "success",
        data: false,
      });
    }
  } catch (err) {
    return NextResponse.json({
      status: "error",
      message: err,
    });
  }
}
