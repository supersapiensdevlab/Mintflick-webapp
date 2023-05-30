import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOneAndUpdateEvent } from "@/utils/event/event";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const eventId: string = req.eventId;
    const ticketId: string = req.ticketId;
    const ownerWallet: string = req.ownerWallet;
    if (eventId && ticketId && ownerWallet) {
      const update = await findOneAndUpdateEvent(
        { eventId: eventId },
        {
          $set: {
            bookings: { ticketId: ticketId, owner: ownerWallet },
          },
        },
        { upsert: true, new: true }
      );
      if (!update.success) {
        return NextResponse.json({ status: "error", message: update.error });
      }

      return NextResponse.json({
        status: "success",
        message: "Ticket booked successfully",
      });
    } else {
      return NextResponse.json({
        status: "error",
        message:
          "Missing something from required Parameters eventId/ticketId/ownerWallet",
      });
    }
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
