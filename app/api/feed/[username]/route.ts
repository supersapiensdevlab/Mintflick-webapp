import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOneAndUpdateEvent } from "@/utils/event/event";
import { findOne } from "@/utils/user/user";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { username: string };
  }
) {
  try {
    await conn();
    const req = await request.json();
    const username = params.username;
    let feeds: any = [];
    const { success, user, error } = await findOne({ username: username });
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }
    if (user) {
      if (user.videos) {
        user.videos.map((v: any) => {
          feeds.push({
            user_id: user._id,
            wallet_id: user.wallet_id,
            username: user.username,
            name: user.name,
            profile_image: user.profile_image,
            superfan_data: user.superfan_data,
            content: v,
            content_type: "video",
            reports: user.reports,
            superfan_to: user.superfan_to,
          });
        });
      }
      if (user.tracks) {
        user.tracks.map((v: any) => {
          feeds.push({
            user_id: user._id,
            wallet_id: user.wallet_id,
            username: user.username,
            name: user.name,
            profile_image: user.profile_image,
            superfan_data: user.superfan_data,
            content: v,
            content_type: "track",
            reports: user.reports,
            superfan_to: user.superfan_to,
          });
        });
      }
      if (user.posts) {
        user.posts.map((v: any) => {
          feeds.push({
            user_id: user._id,
            wallet_id: user.wallet_id,
            username: user.username,
            name: user.name,
            profile_image: user.profile_image,
            superfan_data: user.superfan_data,
            content: v,
            content_type: "post",
            reports: user.reports,
            superfan_to: user.superfan_to,
          });
        });
      }
      if (user.polls) {
        user.polls.map((v: any) => {
          feeds.push({
            user_id: user._id,
            wallet_id: user.wallet_id,
            username: user.username,
            name: user.name,
            profile_image: user.profile_image,
            superfan_data: user.superfan_data,
            content: v,
            content_type: "poll",
            reports: user.reports,
            superfan_to: user.superfan_to,
          });
        });
      }
      feeds.sort((a: any, b: any) => {
        let da: any = new Date(a.content.time * 1);
        let db: any = new Date(b.content.time * 1);
        return db - da;
      });
      return NextResponse.json({
        status: "success",
        message: "Treasury converted successfully",
        data: feeds,
      });
    } else {
      return NextResponse.json({ status: "error", message: "user not found" });
    }
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
