import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findEvent } from "@/utils/event/event";

export async function GET(request: Request) {
  try {
    await conn();

    const { success, event, error } = await findEvent();
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }
    return NextResponse.json({
      status: "success",
      message: "Treasury converted successfully",
      data: event,
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
