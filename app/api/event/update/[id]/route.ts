import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOneAndUpdateEvent } from "@/utils/event/event";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  try {
    await conn();
    const req = await request.json();
    const id = params.id;
    const update = await findOneAndUpdateEvent(
      { eventId: id },
      {
        $push: {
          name: req.name,
          banner: req.banner,
          description: req.description,
          tasks: req.tasks,
          status: req.status,
        },
      },
      {}
    );
    if (!update.success) {
      return NextResponse.json({ status: "error", message: update.error });
    }
    return NextResponse.json({
      status: "success",
      message: "Event updated successfully",
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
