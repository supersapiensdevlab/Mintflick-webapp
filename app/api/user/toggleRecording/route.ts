import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOneAndUpdate } from "@/utils/user/user";
import { LIVEPEER_CONFIG } from "@/services/config.service";
import axios from "axios";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const livepeerKey = LIVEPEER_CONFIG.livepeerkey;
    const AuthStr = "Bearer ".concat(livepeerKey);
    const id = req.id;
    const recording = req.recording;
    const username = req.username;

    const value = await axios({
      method: "patch",
      url: `https://livepeer.studio/api/stream/${id}/record`,
      data: { record: recording },
      headers: {
        "content-type": "application/json",
        Authorization: AuthStr,
      },
    });
    const value2 = await axios({
      method: "get",
      url: `https://livepeer.studio/api/stream/${id}`,
      headers: {
        Authorization: AuthStr,
      },
    });
    const update = await findOneAndUpdate(
      { username: username },
      {
        $set: {
          livepeer_data: value2.data,
        },
      },
      { upsert: true }
    );
    if (!update.success) {
      return NextResponse.json({ status: "error", message: update.error });
    }
    return NextResponse.json({
      status: "success",
      message: "Recording toggled successfully",
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
