import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOneAndUpdate, findOne } from "@/utils/user/user";
import { findOneAndUpdateFeed } from "@/utils/feed/feed";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const { success, user, error } = await findOne({ _id: req.user_id });
    const tokenId = req.tokenId;
    const contentId = req.contentId;
    const contentType = req.contentType;
    if (success) {
      let data;
      let count = -1;
      switch (contentType) {
        case "post":
          data = user.posts;
          data.forEach((value: any, i: any) => {
            if (value.postId == contentId) {
              count = i;
            }
          });
          break;
        case "video":
          data = user.videos;
          data.forEach((value: any, i: any) => {
            if (value.videoId == contentId) {
              count = i;
            }
          });
          break;
      }

      if (count != -1) {
        console.log("in2");
        data[count].tokenId = tokenId;
        if (contentType == "post") {
          const updatePosts = await findOneAndUpdate(
            { username: user.username },
            { $set: { posts: data } },
            {}
          );
          if (!updatePosts.success) {
            return NextResponse.json({
              status: "error",
              message: updatePosts.error,
            });
          }
          const updateTokenIdInFeed = await findOneAndUpdateFeed(
            {
              username: user.username,
              "content.postId": contentId,
            },
            { $set: { "content.tokenId": tokenId } },
            {}
          );
          if (!updateTokenIdInFeed.success) {
            return NextResponse.json({
              status: "error",
              message: updateTokenIdInFeed.error,
            });
          }
        } else if (contentType == "video") {
          const updateVideos = await findOneAndUpdate(
            { username: user.username },
            { $set: { videos: data } },
            {}
          );
          if (!updateVideos.success) {
            return NextResponse.json({
              status: "error",
              message: updateVideos.error,
            });
          }
          const updateVideoTokenIdInFeed = await findOneAndUpdateFeed(
            {
              username: user.username,
              "content.videoId": contentId,
            },
            { $set: { "content.tokenId": tokenId } },
            {}
          );
          if (!updateVideoTokenIdInFeed.success) {
            return NextResponse.json({
              status: "error",
              message: updateVideoTokenIdInFeed.error,
            });
          }
        }
      }
      return NextResponse.json({
        status: "success",
        message: "Added token Id",
      });
    } else {
      return NextResponse.json({
        status: "error",
        message: error,
        data: null,
      });
    }
  } catch (err) {
    return NextResponse.json({ status: "error", message: err, data: null });
  }
}
