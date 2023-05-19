import { findOneAndDeleteEvent, findOneEvent } from "@/utils/event/event";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  try {
    const id = params.id;
    const { success, event, error } = await findOneEvent({ eventId: id });
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }
    return NextResponse.json({
      status: "success",
      message: "Event fetched successfully",
      data: event,
    });
  } catch (error) {
    return NextResponse.json({ status: "error", message: error });
  }
}

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  try {
    const id = params.id;
    const { success, error } = await findOneAndDeleteEvent({ eventId: id });
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }
    return NextResponse.json({
      status: "success",
      message: "Event deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ status: "error", message: error });
  }
}
