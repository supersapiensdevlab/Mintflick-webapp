import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findById, findOneAndUpdate, findOne } from "@/utils/user/user";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const { videoId, value, user_data_id } = req;
    const { success, user, error } = await findOne({ _id: user_data_id });
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }
    let obj = user.videos.find((video: any, i: any) => {
      if (video.videoId == videoId) {
        user.videos[i].disableComments = value;
        return true; // stop searching
      }
    });
    if (obj) {
      await user.markModified("videos");
      await user.save();
      return NextResponse.json({
        status: "success",
        message: "TComment disabled successfully",
      });
    } else {
      return NextResponse.json({
        status: "error",
        message: "No media found with matching id",
      });
    }
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
