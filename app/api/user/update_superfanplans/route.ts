import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOne, findOneAndUpdate } from "@/utils/user/user";
import { updateMany } from "@/utils/feed/feed";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const superfanData = req.superfanData;
    const id: string = req.id;
    const { success, user, error } = await findOne({ id: id });
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }
    const update = await findOneAndUpdate(
      { id: user.id },
      {
        $set: {
          superfan_data: superfanData,
        },
      },
      {}
    );
    if (!update.success) {
      return NextResponse.json({ status: "error", message: update.error });
    }
    const updateFeed = await updateMany(
      { username: user.username },
      {
        $set: {
          superfan_data: superfanData,
        },
      }
    );
    if (!updateFeed.success) {
      return NextResponse.json({ status: "error", message: updateFeed.error });
    }
    return NextResponse.json({
      status: "success",
      message: "Plans updated successfully",
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
