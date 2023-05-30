import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findByIdAndUpdate } from "@/utils/user/user";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const { streamSchedule } = req;
    if (!streamSchedule) {
      return NextResponse.json({
        status: "error",
        message: "Missing stream schedule",
      });
    }
    const update = await findByIdAndUpdate(req.user_id, {
      streamSchedule: streamSchedule,
    });

    if (!update.success) {
      return NextResponse.json({ status: "error", message: update.error });
    }

    return NextResponse.json({
      status: "success",
      message: "Stream scheduled successfully",
      data: update.user,
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
