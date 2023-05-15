import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findById, findOneAndUpdate, find } from "@/utils/user/user";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const txnHash = req.txnHash;
    const superfanof = req.superfanof;
    const receiptTime = req.timestamp;
    const user = await findById(req.user_id);

    const superfanOfUser = await find({ username: superfanof });
    var superfanData = {
      username: superfanof,
      plan: req.plan,
      txnHash: txnHash,
      boughtOn: receiptTime,
    };

    //console.log(follower);
    const announcementData = {
      announcement: `${user.username} subscribed to your ${req.plan} superfan plan`,
      post_image: user.profile_image ? user.profile_image : null,
      post_video: null,
      link: `/hoemscreen/profile/${user.username}`,
      time: receiptTime,
      username: user.username,
      linkpreview_data: null,
    };

    let count = -1;

    if (user.superfan_of) {
      user.superfan_of.forEach((val: any, i: any) => {
        if (val.username === superfanof) {
          count = i;
        }
      });
    }
    if (count != -1) {
      let data = user.superfan_of;
      data[count] = superfanData;
      await findOneAndUpdate(
        { username: user.username },
        {
          $set: { superfan_of: data },
        },
        {}
      );
    } else {
      await findOneAndUpdate(
        { username: user.username },
        {
          $push: { superfan_of: superfanData },
        },
        {}
      );
    }

    superfanData = {
      username: user.username,
      plan: req.plan,
      txnHash: req.txnHash,
      boughtOn: receiptTime,
    };

    let Ofcount = -1;

    if (superfanOfUser[0].superfan_to) {
      superfanOfUser[0].superfan_to.forEach((val: any, i: any) => {
        if (val.username == user.username) {
          Ofcount = i;
        }
      });
    }

    if (Ofcount != -1) {
      let data = superfanOfUser[0].superfan_to;
      data[Ofcount] = superfanData;
      await findOneAndUpdate(
        { username: superfanof },
        {
          $set: { superfan_to: data },
        },
        {}
      );

      await findOneAndUpdate(
        { username: superfanof },
        {
          $push: { notification: announcementData },
        },
        {}
      );
    } else {
      await findOneAndUpdate(
        { username: superfanof },
        {
          $push: { superfan_to: superfanData },
          notification: announcementData,
        },
        {}
      );
    }

    //const ret = await User.findOne({ username: superfan_to });

    return NextResponse.json({ status: "success" });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
