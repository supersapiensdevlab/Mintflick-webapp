import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findById, findOneAndUpdate } from "@/utils/user/user";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const { id, url, image } = req;
    const { success, user, error } = await findById(req.user_id);
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }
    if (url == "" && image == "") {
      return NextResponse.json({
        status: "error",
        message: "Missing url or image",
      });
    }
    if (user.streamLinks) {
      user.streamLinks = user.streamLinks.filter(function (l: any) {
        return l.id !== id;
      });
      user.markModified("streamLinks");
    }
    await user.save();
    return NextResponse.json({
      status: "success",
      message: "Link Removed successfully",
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
