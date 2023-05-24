import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOne, findOneAndUpdate } from "@/utils/user/user";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const value = req.coins;
    const receivedBy = req.receivedBy;
    const prevBalance = req.prevBalance;
    const update = req.update;
    const tasksPerformed = req.tasksPerformed;
    const id: string = req.id;
    const { success, user, error } = await findOne({ id: id });
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }
    if (req.type === "social") {
      if (!prevBalance) {
        const data = {
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

        const setCoins = await findOneAndUpdate(
          { username: user.username },
          {
            $set: { coins: data },
          },
          {}
        );
        if (!setCoins.success) {
          return NextResponse.json({
            status: "error",
            message: setCoins.error,
          });
        }
        return NextResponse.json({ status: "success" });
      } else {
        const total = prevBalance ? prevBalance + value : value;
        const data = {
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

        const setBalance = await findOneAndUpdate(
          { username: user.username },
          {
            $set: { "coins.balance": total },
          },
          {}
        );
        if (!setBalance.success) {
          return NextResponse.json({
            status: "error",
            message: setBalance.error,
          });
        }
        const setHistory = await findOneAndUpdate(
          { username: user.username },
          {
            $push: { "coins.history": data },
          },
          {}
        );
        if (!setHistory.success) {
          return NextResponse.json({
            status: "error",
            message: setHistory.error,
          });
        }
        const setTasks = await findOneAndUpdate(
          { username: user.username },
          {
            $set: { "coins.tasksPerformed": tasksPerformed },
          },
          {}
        );
        if (!setTasks.success) {
          return NextResponse.json({
            status: "error",
            message: setTasks.error,
          });
        }
        return NextResponse.json({ status: "success" });
      }
    }

    if (req.type === "platformTasks") {
      if (!prevBalance) {
        const data = {
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

        const set = await findOneAndUpdate(
          { username: user.username },
          {
            $set: { coins: data },
          },
          {}
        );
        if (!set.success) {
          return NextResponse.json({
            status: "error",
            message: set.error,
          });
        }
        return NextResponse.json({ status: "success" });
      } else {
        const total = prevBalance ? prevBalance + value : value;
        const historyData = {
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
