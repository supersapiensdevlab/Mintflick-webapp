import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findById, updateOne } from "@/utils/user/user";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const username = req.username;
    const profile_image = req.nft_image;
    const user = await findById(req.user_id);
    // console.log(following, follower);

    const announcementData = {
      announcement: `Check out ${username}'s new NFT`,
      post_image: profile_image ? profile_image : null,
      post_video: null,
      link: `/hoemscreen/profile/${user.username}/store`,
      time: Date.now() / 1000,
      username: username,
      linkpreview_data: null,
    };

    user.follower_count.forEach(async function (id: any) {
      await updateOne(
        { username: id },
        { $push: { notification: announcementData } }
      );
    });
    return NextResponse.json({ status: "success" });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
