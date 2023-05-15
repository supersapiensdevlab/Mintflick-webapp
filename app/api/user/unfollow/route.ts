import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findById, findOneAndUpdate } from "@/utils/user/user";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const following = req.following;
    const user = await findById(req.user_id);

    const announcementData = {
      announcement: `${user.username} unfollowed you`,
      post_image: user.profile_image ? user.profile_image : null,
      post_video: null,
      link: `/homescreen/profile/${user.username}`,
      time: Date.now() / 1000,
      username: user.username,
      linkpreview_data: null,
    };

    await findOneAndUpdate(
      { username: following },
      { $pull: { follower_count: user.username } },
      {}
    );

    await findOneAndUpdate(
      { username: following },
      { $push: { notification: announcementData } },
      {}
    );

    await findOneAndUpdate(
      { username: user.username },
      { $pull: { followee_count: following } },
      {}
    );
    await findOneAndUpdate(
      { username: user.username },
      { $pull: { pinned: following } },
      {}
    );

    return NextResponse.json({ status: "success", message: "Unollow success" });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
