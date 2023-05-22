import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findById, findOneAndUpdate } from "@/utils/user/user";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const { success, user, error } = await findById(req.id);
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }
    user.name = req.name;
    user
      .save()
      .then(() => {
        return NextResponse.json({
          status: "success",
          message: "user details updated successfully",
          data: user,
        });
      })
      .catch((err: any) => {
        return NextResponse.json({ status: "error", message: err });
      });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
