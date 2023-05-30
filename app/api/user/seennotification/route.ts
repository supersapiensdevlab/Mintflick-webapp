import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOne, updateOne } from "@/utils/user/user";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const id: string = req.id;
    const { success, user, error } = await findOne({ id: id });
    if (success) {
      let data = [];
      if (user.oldnotification.length > 0) {
        data = user.oldnotification;
      }
      for (let i = 0; i < user.notification.length; i++) {
        data.push(user.notification[i]);
      }
      const updateNewNotification = await updateOne(
        { username: user.username },
        { notification: [] }
      );
      if (!updateNewNotification.success) {
        return NextResponse.json({
          status: "error",
          message: updateNewNotification.error,
        });
      }
      const updateOldNotification = await updateOne(
        { username: user.username },
        { oldnotification: data }
      );
      if (!updateOldNotification.success) {
        return NextResponse.json({
          status: "error",
          message: updateOldNotification.error,
        });
      }
      return NextResponse.json({
        status: "success",
        message: "Notification details set successfully",
      });
    } else {
      return NextResponse.json({ status: "error", message: error });
    }
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
