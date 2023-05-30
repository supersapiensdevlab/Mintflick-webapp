import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOne, findOneAndUpdate } from "@/utils/user/user";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const { url, image } = req;
    const id: string = req.id;
    const { success, user, error } = await findOne({ id: id });
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }
    if (url == "" && image == "" && user.streamLinks.length > 4) {
      return NextResponse.json({
        status: "error",
        message: "Missing url or image",
      });
    }
    if (user.streamLinks) {
      user.streamLinks = [...user.streamLinks, { id: Date.now(), url, image }];
      await user.markModified("streamLinks");
    } else {
      user.streamLinks = [{ id: Date.now(), url, image }];
    }
    await user.save();
    return NextResponse.json({
      status: "success",
      message: "Link Added successfully",
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
