import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOne, findOneAndUpdate } from "@/utils/user/user";
import { findOneAndUpdateFeed } from "@/utils/feed/feed";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const reactusername = req.reactusername;
    const pollusername = req.pollusername;
    const pollId = req.pollId;
    const voted = req.voted;
    const { success, user, error } = await findOne({ username: pollusername });

    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }

    let count = -1;
    for (let i = 0; i < user.polls.length; i++) {
      if (user.polls[i].pollId === pollId) {
        count = i;
        break;
      }
    }

    if (count != -1) {
      let data = user.polls;
      if (!data[count].options[voted].selectedBy) {
        data[count].options[voted].selectedBy = [];
        data[count].options[voted].selectedBy.push(reactusername);
        data[count].votes.push(reactusername);
      } else if (
        !data[count].options[voted].selectedBy.includes(reactusername)
      ) {
        data[count].options[voted].selectedBy.push(reactusername);
        data[count].votes.push(reactusername);
      } else if (
        data[count].options[voted].selectedBy.includes(reactusername)
      ) {
        let newArray = data[count].options[voted].selectedBy.filter(
          (item: any, index: any) => item != reactusername
        );
        data[count].options[voted].selectedBy = newArray;
        newArray = data[count].votes.filter(
          (item: any, index: any) => item != reactusername
        );

        data[count].votes = newArray;
      }

      if (user.polls[count].options[voted].selectedBy.includes(reactusername)) {
        const announcementData = {
          announcement: `${reactusername} voted to your poll`,
          post_image: user.polls[count].pollImage
            ? user.polls[count].pollImage
            : null,
          post_video: null,
          link: `/homescreen/${pollusername}/poll/${pollId}`,
          time: Date.now() / 1000,
          username: user.username,
          linkpreview_data: null,
        };
        const pushNotification = await findOneAndUpdate(
          { username: pollusername },
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

      const update = await findOneAndUpdate(
        { username: pollusername },
        { $set: { polls: data } },
        { upsert: true }
      );

      if (!update.success) {
        return NextResponse.json({ status: "error", message: update.error });
      }

      const updateFeed = await findOneAndUpdateFeed(
        {
          username: pollusername,
          "content.pollId": pollId,
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
      message: "Poll voted successfully",
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
