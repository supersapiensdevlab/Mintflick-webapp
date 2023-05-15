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

    const user = await findOne({ username: username });

    await findOneAndUpdate(
      { username: username },
      {
        $set: { "gems.balance": user.gems.balance + 50 },
      },
      {}
    );
    return NextResponse.json({
      status: "success",
      message: "Gems sent successfully",
    });
  } catch (error) {
    return NextResponse.json({ status: "error", message: error });
  }
}
