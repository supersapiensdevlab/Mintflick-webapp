import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOne, findOneAndUpdate } from "@/utils/user/user";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const following: string = req.following;
    const id: string = req.id;
    const { success, user, error } = await findOne({ id: id });
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }

    const announcementData = {
      announcement: `${user.username} unfollowed you`,
      post_image: user.profile_image ? user.profile_image : null,
      post_video: null,
      link: `/homescreen/profile/${user.username}`,
      time: Date.now() / 1000,
      username: user.username,
      linkpreview_data: null,
    };

    const removeFollowing = await findOneAndUpdate(
      { username: following },
      { $pull: { follower_count: user.username } },
      {}
    );
    if (!removeFollowing.success) {
      return NextResponse.json({
        status: "error",
        message: removeFollowing.error,
      });
    }

    const pushNotification = await findOneAndUpdate(
      { username: following },
      { $push: { notification: announcementData } },
      {}
    );
    if (!pushNotification.success) {
      return NextResponse.json({
        status: "error",
        message: pushNotification.error,
      });
    }

    const removeFollower = await findOneAndUpdate(
      { username: user.username },
      { $pull: { followee_count: following } },
      {}
    );
    if (!removeFollower.success) {
      return NextResponse.json({
        status: "error",
        message: removeFollower.error,
      });
    }
    const removePinned = await findOneAndUpdate(
      { username: user.username },
      { $pull: { pinned: following } },
      {}
    );
    if (!removePinned.success) {
      return NextResponse.json({
        status: "error",
        message: removePinned.error,
      });
    }

    return NextResponse.json({ status: "success", message: "Unollow success" });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
