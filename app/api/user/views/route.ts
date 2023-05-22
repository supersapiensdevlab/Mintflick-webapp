import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOne, findOneAndUpdate } from "@/utils/user/user";
import { findOneAndUpdateFeed } from "@/utils/feed/feed";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const videoUsername = req.videousername;
    const videoindex = req.videoindex;
    const viewedUser = await findOne({ _id: req.user_id });
    if (!viewedUser.success) {
      return NextResponse.json({ status: "error", message: viewedUser.error });
    }
    const { success, user, error } = await findOne({ username: videoUsername });
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }
    let count = -1;
    for (let i = 0; i < user.videos.length; i++) {
      if (user.videos[i].videoId === videoindex) {
        count = i;
        break;
      }
    }

    if (count != -1) {
      const data = user.videos;
      if (!data[count].views) {
        data[count].views = [];
        data[count].views.push(viewedUser.user.username);
      } else if (!data[count].views.includes(viewedUser.user.username)) {
        data[count].views.push(viewedUser.user.username);
      }

      const updateFeed = await findOneAndUpdateFeed(
        {
          username: videoUsername,
          "content.videoId": videoindex,
        },
        { $set: { content: data[count] } },
        {}
      );
      if (!updateFeed.success) {
        return NextResponse.json({
          status: "error",
          message: updateFeed.error,
        });
      }

      const update = await findOneAndUpdate(
        { username: videoUsername },
        { $set: { videos: data } },
        { upsert: true }
      );
      if (!update.success) {
        return NextResponse.json({ status: "error", message: update.error });
      }
    }
    return NextResponse.json({
      status: "success",
      message: "Views added successfully",
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
