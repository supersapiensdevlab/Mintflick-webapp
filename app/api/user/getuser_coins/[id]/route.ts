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

    const user = await findOne({ id: id });

    if (user.coins) {
      let coins = user.coins;
      return NextResponse.json({ status: "success", data: coins });
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
