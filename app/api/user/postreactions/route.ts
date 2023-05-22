import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOne, findOneAndUpdate } from "@/utils/user/user";
import { findOneAndUpdateFeed } from "@/utils/feed/feed";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const reactusername = req.reactusername;
    const postusername = req.postusername;
    const postId = req.postId;

    const { success, user, error } = await findOne({ username: postusername });
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }

    let count = -1;
    for (let i = 0; i < user.posts.length; i++) {
      if (user.posts[i].postId === postId) {
        count = i;
        break;
      }
    }

    if (count != -1) {
      const data = user.posts;
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

      if (user.posts[count].likes.includes(reactusername)) {
        const announcementData = {
          announcement: `${reactusername} liked your post`,
          post_image: user.posts[count].post_image
            ? user.posts[count].post_image
            : null,
          post_video: null,
          link: `/homescreen/${postusername}/post/${postId}`,
          time: Date.now() / 1000,
          username: user.username,
          linkpreview_data: null,
        };
        if (reactusername !== postusername) {
          const pushNotification = await findOneAndUpdate(
            { username: postusername },
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
        { username: postusername },
        { $set: { posts: data } },
        { upsert: true }
      );

      if (!update.success) {
        return NextResponse.json({ status: "error", message: update.error });
      }

      const updateFeed = await findOneAndUpdateFeed(
        {
          username: postusername,
          "content.postId": postId,
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
      message: "Post reaction added successfully",
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
