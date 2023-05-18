import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOneAndUpdateEvent } from "@/utils/event/event";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const { eventId, ticketId } = req;
    if (eventId && ticketId) {
      const update = await findOneAndUpdateEvent(
        { eventId: eventId },
        {
          $push: {
            verifiedTickets: ticketId,
          },
        },
        { upsert: true, new: true }
      );
      if (!update.success) {
        return NextResponse.json({ status: "error", message: update.error });
      }

      return NextResponse.json({
        status: "success",
        message: "Ticket verified successfully",
      });
    } else {
      return NextResponse.json({
        status: "error",
        message: "Missing something from required Parameters eventId/ticketId",
      });
    }
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
