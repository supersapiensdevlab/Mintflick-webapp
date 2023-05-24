import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findById, findOneAndUpdate } from "@/utils/user/user";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: { username: string };
  }
) {
  try {
    await conn();
    const username: string = params.username;
    const update = await findOneAndUpdate(
      { username: username },
      { $inc: { "refer.clicks": 1 } },
      { upsert: true }
    );
    if (!update.success) {
      return NextResponse.json({ status: "error", message: update.error });
    }
    return NextResponse.json({
      status: "success",
      message: `You have been Referred by ${username}`,
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
