import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOneAndUpdate } from "@/utils/user/user";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const field = req.field; // replace with the actual field name
    const value = req.value ? req.value : true; // replace with the new value

    const username = req.username;

    console.log("Updating...", username);

    const setIntoSeen = await findOneAndUpdate(
      { username: username },
      { $set: { [`seenIntro.${field}`]: value } },
      {}
    );
    if (!setIntoSeen.success) {
      return NextResponse.json({
        status: "error",
        message: setIntoSeen.error,
      });
    }
    return NextResponse.json({
      status: "success",
      message: "Intro seen by user",
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
