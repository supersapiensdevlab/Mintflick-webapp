import { findOne, findOneAndUpdate } from "@/utils/user/user";
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
    const username = params.username;

    const { success, user, error } = await findOne({ username: username });
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }
    const getGems = await findOneAndUpdate(
      { username: username },
      {
        $set: { "gems.balance": user.gems.balance + 50 },
      },
      {}
    );
    if (!getGems.success) {
      return NextResponse.json({
        status: "error",
        message: getGems.error,
      });
    }
    return NextResponse.json({
      status: "success",
      message: "Gems sent successfully",
    });
  } catch (error) {
    return NextResponse.json({ status: "error", message: error });
  }
}
