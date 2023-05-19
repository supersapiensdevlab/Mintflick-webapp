import { findEvent } from "@/utils/event/event";
import { findOne, findOneAndUpdate } from "@/utils/user/user";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { success, event, error } = await findEvent();
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }
    return NextResponse.json({
      status: "success",
      message: "Events fetched successfully",
      data: event,
    });
  } catch (error) {
    return NextResponse.json({ status: "error", message: error });
  }
}
