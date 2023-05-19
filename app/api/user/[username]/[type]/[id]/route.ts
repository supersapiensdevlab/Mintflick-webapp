import { findOne, findOneAndUpdate } from "@/utils/user/user";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { username: string; type: string; id: string };
  }
) {
  try {
    const username = params.username;
    const type = params.type;
    const id = params.id;
    const { success, user, error } = await findOne({ username: username });
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }
    let content = null;
    switch (type) {
      case "video":
        content = user.videos.filter((v: any) => {
          return v.videoId === id;
        });
        break;
      case "track":
        content = user.tracks.filter((v: any) => {
          return v.trackId === id;
        });
        break;
      case "post":
        content = user.posts.filter((v: any) => {
          return v.postId === id;
        });
        break;
      case "poll":
        content = user.polls.filter((v: any) => {
          return v.pollId === id;
        });
        break;
      default:
        return NextResponse.json({
          status: "error",
          message: "content type didn't match",
        });
    }
    if (content[0]) {
      let totaldata = {
        user_id: user._id,
        wallet_id: user.wallet_id,
        username: user.username,
        name: user.name,
        profile_image: user.profile_image,
        superfan_data: user.superfan_data,
        content: content[0],
        content_type: type,
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
        message: `${type} not found`,
      });
    }
  } catch (error) {
    return NextResponse.json({ status: "error", message: error });
  }
}
