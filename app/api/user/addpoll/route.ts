import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { makeid } from "@/utils/makeId/makeId";
import { User } from "@/utils/models/user.model";
import { Feed } from "@/utils/models/feed.model";
import { findOneAndUpdate } from "@/utils/user/user";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const id: string = req.id;
    if (req.question && req.options) {
      const uid = makeid(7);
      var currentTimeInSeconds = Math.floor(Date.now() / 1000);
      const poll = {
        pollId: uid,
        question: req.question,
        options: req.options,
        tokenId: null,
        meta_url: null,
        time: currentTimeInSeconds,
        votes: [],
        likes: [],
        comments: [],
      };
      const update = await findOneAndUpdate(
        { id: id },
        { $push: { polls: poll } },
        {}
      );
      if (!update.success) {
        return NextResponse.json({
          status: "error",
          message: update.error,
        });
      }
      var trend = new Feed({
        user_id: update.user._id,
        wallet_id: update.user.wallet_id,
        username: update.user.username,
        name: update.user.name,
        profile_image: update.user.profile_image,
        superfan_data: update.user.superfan_data,
        content: poll,
        content_type: "poll",
        reports: update.user.reports,
        superfan_to: update.user.superfan_to,
      });
      await trend.save();
      return NextResponse.json({
        status: "success",
        message: "Poll created successfully",
        data: update.user,
      });
    } else {
      return NextResponse.json({
        status: "error",
        message: "Missing data in req",
      });
    }
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
