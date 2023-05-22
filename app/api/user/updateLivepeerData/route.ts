import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOneAndUpdate } from "@/utils/user/user";
import { LIVEPEER_CONFIG } from "@/services/config.service";
import axios from "axios";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const id = req.id;
    const username = req.username;
    const livepeerKey = LIVEPEER_CONFIG.livepeerkey;
    const AuthStr = "Bearer ".concat(livepeerKey);
    const value = await axios({
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
          livepeer_data: value.data,
        },
      },
      { upsert: true }
    );
    if (!update.success) {
      NextResponse.json({ status: "error", message: update.error });
    }
    NextResponse.json({
      status: "success",
      message: "Livepeer Data Updated successfully",
    });
    return value.status;
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
