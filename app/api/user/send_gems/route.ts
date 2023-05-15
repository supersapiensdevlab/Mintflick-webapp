import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findById, findOneAndUpdate } from "@/utils/user/user";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const value = req.coins;
    const receivedBy = req.receivedBy;
    const prevBalance = req.prevBalance;
    const update = req.update;
    const tasksPerformed = req.tasksPerformed;
    const user = await findById(req.user_id);

    if (req.type === "social") {
      if (!prevBalance) {
        let data = {
          balance: value,
          history: [
            {
              receivedBy: receivedBy,
              time: Date.now() / 1000,
            },
          ],
          tasksPerformed: {
            followedTwitter: update == "followedTwitter" ? true : false,
            followedInstagram: update == "followedInstagram" ? true : false,
            followedLinkedin: update == "followedLinkedin" ? true : false,
            followedDiscord: update == "followedDiscord" ? true : false,
            firstPost: false,
            followFive: false,
          },
        };

        await findOneAndUpdate(
          { username: user.username },
          {
            $set: { coins: data },
          },
          {}
        );
        return NextResponse.json({ status: "success" });
      } else {
        let total = prevBalance ? prevBalance + value : value;
        let data = {
          receivedBy: receivedBy,
          time: Date.now() / 1000,
        };
        switch (update) {
          case "followedTwitter":
            tasksPerformed.followedTwitter = true;
            break;
          case "followedInstagram":
            tasksPerformed.followedInstagram = true;
            break;
          case "followedLinkedin":
            tasksPerformed.followedLinkedin = true;
            break;
          case "followedDiscord":
            tasksPerformed.followedDiscord = true;
            break;
        }

        await findOneAndUpdate(
          { username: user.username },
          {
            $set: { "coins.balance": total },
          },
          {}
        );

        await findOneAndUpdate(
          { username: user.username },
          {
            $push: { "coins.history": data },
          },
          {}
        );
        await findOneAndUpdate(
          { username: user.username },
          {
            $set: { "coins.tasksPerformed": tasksPerformed },
          },
          {}
        );
        return NextResponse.json({ status: "success" });
      }
    }

    if (req.type === "platformTasks") {
      if (!prevBalance) {
        let data = {
          balance: value,
          history: [
            {
              receivedBy: receivedBy,
              time: Date.now() / 1000,
            },
          ],
          tasksPerformed: {
            followedTwitter: false,
            followedInstagram: false,
            followedLinkedin: false,
            followedDiscord: false,
            firstPost: update == "firstPost" ? true : false,
            followFive: update == "follow" ? true : false,
          },
        };

        await findOneAndUpdate(
          { username: user.username },
          {
            $set: { coins: data },
          },
          {}
        );

        return NextResponse.json({ status: "success" });
      } else {
        let total = prevBalance ? prevBalance + value : value;
        let historyData = {
          receivedBy: receivedBy,
          time: Date.now() / 1000,
        };
        switch (update) {
          case "follow":
            tasksPerformed.followFive = true;
            break;
          case "firstPost":
            tasksPerformed.firstPost = true;
            break;
        }
        await findOneAndUpdate(
          { username: user.username },
          {
            $set: { "coins.balance": total },
          },
          {}
        );

        await findOneAndUpdate(
          { username: user.username },
          {
            $push: { "coins.history": historyData },
          },
          {}
        );
        await findOneAndUpdate(
          { username: user.username },
          {
            $set: { "coins.tasksPerformed": tasksPerformed },
          },
          {}
        );
        return NextResponse.json({ status: "success" });
      }
    }
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
