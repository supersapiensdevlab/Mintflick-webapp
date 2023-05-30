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
    const plan: string = req.plan;
    const txnHash: string = req.txnHash;
    const type: string = req.type;
    const id: string = req.id;

    const update = await findOneAndUpdate(
      { id: id },
      {
        $push: {
          subscription: {
            plan: plan,
            txnHash: txnHash,
            type: type,
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
