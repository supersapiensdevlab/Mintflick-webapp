import { findOne, findOneAndUpdate } from "@/utils/user/user";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { username: string; id: string };
  }
) {
  try {
    const username: string = params.username;
    const pollId: string = params.id;
    const { success, user, error } = await findOne({ username: username });
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }
    const content = user.polls.filter((v: any) => {
      return v.pollId === pollId;
    });
    if (content[0]) {
      const totaldata = {
        user_id: user._id,
        wallet_id: user.wallet_id,
        username: user.username,
        name: user.name,
        profile_image: user.profile_image,
        superfan_data: user.superfan_data,
        content: content[0],
        content_type: "poll",
        reports: user.reports,
        superfan_to: user.superfan_to,
      };
      return NextResponse.json({
        status: "success",
        message: "fetched successfully",
        data: totaldata,
      });
    } else {
      return NextResponse.json({
        status: "error",
        message: `Poll not found`,
      });
    }
  } catch (error) {
    return NextResponse.json({ status: "error", message: error });
  }
}
