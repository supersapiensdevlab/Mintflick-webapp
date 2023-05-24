import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOne, findOneAndUpdate, updateOne } from "@/utils/user/user";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const name: string = req.name;
    const id: string = req.id;
    const { success, user, error } = await findOne({ id: id });
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }
    const update = await updateOne(
      { username: user.username },
      { $set: { name: name } }
    );
    if (!update.success) {
      return NextResponse.json({ status: "error", message: update.error });
    }

    return NextResponse.json({
      status: "success",
      message: "user details updated successfully",
      data: user,
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
