import { findOne, findOneAndUpdate } from "@/utils/user/user";
import { NextResponse } from "next/server";
import { User } from "@/utils/models/user.model";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { wallet_id: string };
  }
) {
  try {
    const wallet_id: string = params.wallet_id;
    await User.findOne({ wallet_id: wallet_id })
      .select({
        username: 1,
        profile_image: 1,
        name: 1,
        email: 1,
        id: 1,
        wallet_id: 1,
      })
      .then((user) => {
        return NextResponse.json({
          status: "success",
          message: "Details fetched successfully",
          data: user,
        });
      })
      .catch((err) => {
        return NextResponse.json({ status: "error", message: err });
      });
  } catch (error) {
    return NextResponse.json({ status: "error", message: error });
  }
}
