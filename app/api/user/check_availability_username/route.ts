import { conn } from "@/services/mongo.service";
import { findOne } from "@/utils/user/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
     const username: string = req.username;
    if (  username) {
      let data = { username: false };
       const isUsernameRegistered = await findOne({ username: username });
      
      if (!isUsernameRegistered.success) {
        return NextResponse.json({
          status: "error",
          message: isUsernameRegistered.error,
        });
      }
      
      if (isUsernameRegistered.user) {
        data.username = true;
      }
      return NextResponse.json({
        status: "success",
        message: "Details fetched",
        data: data,
      });
    } else {
      return NextResponse.json({
        status: "error",
        message: "username or email absent",
        data: null,
      });
    }
  } catch (err) {
    return NextResponse.json({
      status: "error",
      message: err,
      data: null,
    });
  }
}
