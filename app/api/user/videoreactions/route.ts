import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOne, findOneAndUpdate } from "@/utils/user/user";
import { findOneAndUpdateFeed } from "@/utils/feed/feed";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const reactusername = req.reactusername;
    const videousername = req.videousername;
    const videoId = req.videoId;
    const { success, user, error } = await findOne({ username: videousername });
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }

    let count = -1;
    for (let i = 0; i < user.videos.length; i++) {
      if (user.videos[i].videoId === videoId) {
        count = i;
        break;
      }
    }

    if (count != -1) {
      let data = user.videos;
      if (!data[count].likes) {
        data[count].likes = [];
        data[count].likes.push(reactusername);
      } else if (!data[count].likes.includes(reactusername)) {
        data[count].likes.push(reactusername);
      } else if (data[count].likes.includes(reactusername)) {
        let newArray = data[count].likes.filter(
          (item: any, index: any) => item != reactusername
        );
        data[count].likes = newArray;
      }

      if (user.videos[count].likes.includes(reactusername)) {
        const announcementData = {
          announcement: `${reactusername} liked your video`,
          post_image: user.videos[count].videoImage
            ? user.videos[count].videoImage
            : null,
          post_video: null,
          link: `/homescreen/${videousername}/video/${videoId}`,
          time: Date.now() / 1000,
          username: user.username,
          linkpreview_data: null,
        };
        if (reactusername !== videousername) {
          const pushNotification = await findOneAndUpdate(
            { username: videousername },
            {
              $push: {
                notification: announcementData,
              },
            },
            {}
          );
          if (!pushNotification.success) {
            return NextResponse.json({
              status: "error",
              message: pushNotification.error,
            });
          }
        }
      }

      const update = await findOneAndUpdate(
        { username: videousername },
        { $set: { videos: data } },
        { upsert: true }
      );

      if (!update.success) {
        return NextResponse.json({ status: "error", message: update.error });
      }

      const updateFeed = await findOneAndUpdateFeed(
        {
          username: videousername,
          "content.videoId": videoId,
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
    }
    return NextResponse.json({
      status: "success",
      message: "Video reaction added successfully",
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
