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

    if (user.gems) {
      let gems = user.gems;
      return NextResponse.json({
        status: "success",
        message: "Gems fetched successfully",
        data: gems,
      });
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
