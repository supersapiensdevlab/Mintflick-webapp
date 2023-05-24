import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOneAndUpdate } from "@/utils/user/user";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const url: string = req.url;
    const id: string = req.id;
    const addThumbnail = await findOneAndUpdate(
      { id: id },

      { $set: { thumbnail: url } },
      {}
    );
    if (!addThumbnail.success) {
      return NextResponse.json({
        status: "error",
        message: addThumbnail.error,
      });
    }
    return NextResponse.json({
      status: "success",
      message: "Treasury converted successfully",
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
