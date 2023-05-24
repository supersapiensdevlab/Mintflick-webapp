import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOneEvent } from "@/utils/event/event";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  try {
    await conn();
    const id: string = params.id;
    const { success, event, error } = await findOneEvent({ eventId: id });
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
