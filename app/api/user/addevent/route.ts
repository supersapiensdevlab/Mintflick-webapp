import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findById, findOneAndUpdate } from "@/utils/user/user";
import { makeid } from "@/utils/makeId/makeId";
import { insertOneEvent } from "@/utils/event/event";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    if (!req.title) {
      return NextResponse.json({
        status: "error",
        message: "Missing event title",
      });
    }
    const uid = makeid(7);
    var currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const event = {
      eventId: uid,
      title: req.title,
      type: req.type,
      category: req.category,
      freeEvent: req.freeEvent,
      ticketPrice: req.ticketPrice,
      unlimitedTickets: req.unlimitedTickets,
      ticketCount: req.ticketCount,
      description: req.description,
      startTime: req.startTime,
      endTime: req.endTime,
      timeZone: req.timeZone,
      eventImage: req.eventImage,
      eventGallery: req.eventGallery,
      eventHost: req.eventHost,
      eventUrl: req.eventUrl,
      location: req.location,
      lockId: req.lockId,
      time: currentTimeInSeconds,
      socialLinks: req.socialLinks,
    };

    const update = await findOneAndUpdate(
      { id: req.user_id },
      {
        $push: { events: event },
      },
      {}
    );

    if (!update.success) {
      return NextResponse.json({ status: "error", message: update.error });
    }

    const updateEvent = await insertOneEvent(event);

    if (!updateEvent.success) {
      return NextResponse.json({ status: "error", message: updateEvent.error });
    }

    return NextResponse.json({
      status: "success",
      message: "Event created successfully",
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
