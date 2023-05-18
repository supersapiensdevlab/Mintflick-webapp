import { conn } from "@/services/mongo.service";
import { findOne } from "@/utils/user/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const { email, username } = req;
    if (email && username) {
      let data = { username: false, email: false };
      const isEmailRegistered = await findOne({ email: email });
      const isUsernameRegistered = await findOne({ username: username });
      if (!isEmailRegistered.success) {
        return NextResponse.json({
          status: "error",
          message: isEmailRegistered.error,
        });
      }
      if (!isUsernameRegistered.success) {
        return NextResponse.json({
          status: "error",
          message: isUsernameRegistered.error,
        });
      }
      if (isEmailRegistered.user) {
        data.email = true;
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
