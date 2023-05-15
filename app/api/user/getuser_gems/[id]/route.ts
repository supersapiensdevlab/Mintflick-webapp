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

    if (user.gems) {
      let gems = user.gems;
      return NextResponse.json({ status: "success", data: gems });
    } else {
      return NextResponse.json({
        status: "success",
        data: null,
        message: "No gems earned yet",
      });
    }
  } catch (error) {
    return NextResponse.json({ status: "error", message: error });
  }
}
