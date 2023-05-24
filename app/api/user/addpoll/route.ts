import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { makeid } from "@/utils/makeId/makeId";
import { User } from "@/utils/models/user.model";
import { Feed } from "@/utils/models/feed.model";

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
      await User.findOneAndUpdate({ id: id }, { $push: { polls: poll } })
        .then(async (data) => {
          var trend = new Feed({
            user_id: data._id,
            wallet_id: data.wallet_id,
            username: data.username,
            name: data.name,
            profile_image: data.profile_image,
            superfan_data: data.superfan_data,
            content: poll,
            content_type: "poll",
            reports: data.reports,
            superfan_to: data.superfan_to,
          });
          await trend.save();
          return NextResponse.json({
            status: "success",
            message: "Poll created successfully",
            data: data,
          });
        })
        .catch((err) => {
          return NextResponse.json({ status: "error", message: err });
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
