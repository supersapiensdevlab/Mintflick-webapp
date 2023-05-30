import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOneAndUpdateEvent } from "@/utils/event/event";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const eventId = req.eventId;
    if (!eventId) {
      return NextResponse.json({
        status: "error",
        message: "Misssing event id",
      });
    }
    const withdraw = await findOneAndUpdateEvent(
      { eventId: eventId },
      {
        $set: {
          withdrawn: true,
        },
      },
      { upsert: true, new: true }
    );
    if (!withdraw.success) {
      return NextResponse.json({ status: "error", message: withdraw.error });
    }
    return NextResponse.json({
      status: "success",
      message: "Event withdrawn successfully",
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
