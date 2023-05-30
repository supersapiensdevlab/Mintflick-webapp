import { findOne, findOneAndUpdate } from "@/utils/user/user";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { stream_id: string };
  }
) {
  try {
    const stream_id: string = params.stream_id;
    const { success, user, error } = await findOne({
      "livepeer_data.id": stream_id,
    });
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }
    return NextResponse.json({
      status: "success",
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    return NextResponse.json({ status: "error", message: error });
  }
}
