import { findOne } from "@/utils/user/user";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  try {
    const id = params.id;

    const { success, user, error } = await findOne({ id: id });
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }
    if (user.coins) {
      let coins = user.coins;
      return NextResponse.json({
        status: "success",
        message: "Coins fetched successfully",
        data: coins,
      });
    } else {
      return NextResponse.json({
        status: "success",
        message: "No coins collected yet",
        data: null,
      });
    }
  } catch (error) {
    return NextResponse.json({ status: "error", message: error });
  }
}
