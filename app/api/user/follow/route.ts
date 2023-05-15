import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findById, findOneAndUpdate } from "@/utils/user/user";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const following = req.body.following;
    const user = await findById(req.user_id);
    const announcementData = {
      announcement: `${user?.username} started following you`,
      post_image: user?.profile_image ? user?.profile_image : null,
      post_video: null,
      link: `/homescreen/profile/${user?.username}`,
      time: Date.now() / 1000,
      username: user?.username,
      linkpreview_data: null,
    };
    await findOneAndUpdate(
      { username: following },
      {
        $push: {
          follower_count: user?.username,
          notification: announcementData,
        },
      },
      {}
    );
    await findOneAndUpdate(
      { username: user?.username },
      { $push: { followee_count: following } },
      {}
    );
    return NextResponse.json({ status: "success", message: "Follow success" });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
