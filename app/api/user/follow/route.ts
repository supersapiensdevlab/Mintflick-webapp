import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOne, findOneAndUpdate } from "@/utils/user/user";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const following = req.following;
    const id: string = req.id;
    const { success, user, error } = await findOne({ id: id });
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }
    const announcementData = {
      announcement: `${user?.username} started following you`,
      post_image: user?.profile_image ? user?.profile_image : null,
      post_video: null,
      link: `/homescreen/profile/${user?.username}`,
      time: Date.now() / 1000,
      username: user?.username,
      linkpreview_data: null,
    };
    const pushNotification = await findOneAndUpdate(
      { username: following },
      {
        $push: {
          follower_count: user?.username,
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
    const updateFollowing = await findOneAndUpdate(
      { username: user?.username },
      { $push: { followee_count: following } },
      {}
    );
    if (!updateFollowing.success) {
      return NextResponse.json({
        status: "error",
        message: updateFollowing.error,
      });
    }
    return NextResponse.json({ status: "success", message: "Follow success" });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
