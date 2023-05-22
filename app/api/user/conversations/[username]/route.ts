import { findOne } from "@/utils/user/user";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { username: string };
  }
) {
  try {
    const { success, user, error } = await findOne({
      username: params.username,
    });
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }
    return NextResponse.json({
      status: "success",
      message: "Conversations fetched successfully",
      data: user.conversations,
    });
  } catch (error) {
    return NextResponse.json({ status: "error", message: error });
  }
}
