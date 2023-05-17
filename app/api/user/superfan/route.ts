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
    const { success, user, error } = await findById(req.user_id);

    const superfanOfUser = await find({ username: superfanof });
    var superfanData = {
      username: superfanof,
      plan: req.plan,
      txnHash: txnHash,
      boughtOn: receiptTime,
    };

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
      const setData = await findOneAndUpdate(
        { username: user.username },
        {
          $set: { superfan_of: data },
        },
        {}
      );
      if (!setData.success) {
        return NextResponse.json({
          status: "error",
          message: setData.error,
        });
      }
    } else {
      const pushData = await findOneAndUpdate(
        { username: user.username },
        {
          $push: { superfan_of: superfanData },
        },
        {}
      );
      if (!pushData.success) {
        return NextResponse.json({
          status: "error",
          message: pushData.error,
        });
      }
    }

    superfanData = {
      username: user.username,
      plan: req.plan,
      txnHash: req.txnHash,
      boughtOn: receiptTime,
    };

    let Ofcount = -1;
    if (superfanOfUser.user) {
      if (superfanOfUser.user[0].superfan_to) {
        superfanOfUser.user[0].superfan_to.forEach((val: any, i: any) => {
          if (val.username == user.username) {
            Ofcount = i;
          }
        });
      }

      if (Ofcount != -1) {
        let data = superfanOfUser.user[0].superfan_to;
        data[Ofcount] = superfanData;
        const setToData = await findOneAndUpdate(
          { username: superfanof },
          {
            $set: { superfan_to: data },
          },
          {}
        );
        if (!setToData.success) {
          return NextResponse.json({
            status: "error",
            message: setToData.error,
          });
        }

        const pushNotification = await findOneAndUpdate(
          { username: superfanof },
          {
            $push: { notification: announcementData },
          },
          {}
        );
        if (!pushNotification.success) {
          return NextResponse.json({
            status: "error",
            message: pushNotification.error,
          });
        }
      } else {
        const pushToData = await findOneAndUpdate(
          { username: superfanof },
          {
            $push: { superfan_to: superfanData },
            notification: announcementData,
          },
          {}
        );
        if (!pushToData.success) {
          return NextResponse.json({
            status: "error",
            message: pushToData.error,
          });
        }
      }
    }

    //const ret = await User.findOne({ username: superfan_to });

    return NextResponse.json({ status: "success" });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
