import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOneAndUpdate } from "@/utils/user/user";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const currentTimeInSeconds = Math.floor(Date.now() / 1000); //unix timestamp in seconds
    const time = currentTimeInSeconds;
    const addedValidity = req.validity * 24 * 60 * 60;
    const validity = time + addedValidity;

    const update = await findOneAndUpdate(
      { _id: req.user_id },
      {
        $push: {
          subscription: {
            plan: req.plan,
            txnHash: req.txnHash,
            type: req.type,
            validity: validity,
            createdAt: time,
          },
        },
      },
      { upsert: true, new: true }
    );
    if (!update.success) {
      return NextResponse.json({ status: "error", message: update.error });
    }
    return NextResponse.json({
      status: "success",
      message: "Plan bought successfully",
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
