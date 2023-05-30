import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOneAndUpdate } from "@/utils/user/user";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const id: string = req.id;
    const { name, description, category } = req;
    if (name == "") {
      return NextResponse.json({ status: "error", message: "Missing name" });
    }

    const update = await findOneAndUpdate(
      { id: id },
      {
        streamSchedule: { name, description, category },
      },
      {}
    );

    if (!update.success) {
      return NextResponse.json({ status: "error", message: update.error });
    }

    return NextResponse.json({
      status: "success",
      message: "Stream Details saved successfully",
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
