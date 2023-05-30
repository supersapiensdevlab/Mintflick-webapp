import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOne } from "@/utils/user/user";
import { updateMany } from "@/utils/feed/feed";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const username: string = req.username;
    const new_name: string = req.name;
    const new_email: string = req.email;
    const { success, user, error } = await findOne({ username: username });
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }
    if (user.email == new_email) {
      user.name = new_name;
      const temp = await updateMany(
        { username: user.username },
        { name: new_name }
      );
      if (!temp.success) {
        return NextResponse.json({ status: "error", message: temp.error });
      }
      user.save().then(() => {
        return NextResponse.json({
          status: "success",
          message: "user details updated successfully",
        });
      });
    } else {
      const user_emailcheck = await findOne({
        email: new_email,
      });
      if (!user_emailcheck.user) {
        user.is_mail_verified = false;
        user.email = new_email;
        user.name = new_name;
        const temp = await updateMany(
          { username: user.username },
          { name: new_name }
        );
        if (!temp.success) {
          return NextResponse.json({ status: "error", message: temp.error });
        }
        user.save().then(() => {
          return NextResponse.json({
            status: "success",
            message: "user details updated successfully",
          });
        });
      }
    }
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
