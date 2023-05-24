import { findOneAndDelete } from "@/utils/user/user";
import { NextResponse } from "next/server";

import { callCount } from "@/utils/user/user";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { username: string };
  }
) {
  try {
    const username: string = params.username;
    const data = {
      count: callCount[username] ? callCount[username] : 0,
      username: username,
    };
    return NextResponse.json({
      status: "success",
      message: "Limit check",
      data: data,
    });
  } catch (error) {
    return NextResponse.json({ status: "error", message: error });
  }
}
