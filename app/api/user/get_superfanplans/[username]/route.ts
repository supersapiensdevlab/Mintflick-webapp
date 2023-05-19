import { findOne, findOneAndUpdate } from "@/utils/user/user";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { username: string };
  }
) {
  try {
    const username = params.username;
    const { success, user, error } = await findOne({ username: username });
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }
    if (user?.superfan_data && !user?.superfan_of) {
      const data = user.superfan_data;
      return NextResponse.json({
        status: "success",
        message: "fetched successfully",
        data: data,
      });
    } else if (user?.superfan_data && user?.superfan_of) {
      let data = user.superfan_data;
      user?.superfan_of.forEach((value: any) => {
        switch (value.plan) {
          case "Basic":
            if (!data.subscribedToBasic) {
              data.subscribedToBasic = [];
            }
            data.subscribedToBasic.push(value.username);
            break;
          case "Silver":
            if (!data.subscribedToSilver) {
              data.subscribedToSilver = [];
            }
            data.subscribedToSilver.push(value.username);
            break;
          case "Gold":
            if (!data.subscribedToGold) {
              data.subscribedToGold = [];
            }
            data.subscribedToGold.push(value.username);
            break;
        }
      });
      return NextResponse.json({
        status: "success",
        message: "fetched successfully",
        data: data,
      });
    } else {
      return NextResponse.json({
        status: "error",
        message: `Error fetching plans`,
      });
    }
  } catch (error) {
    return NextResponse.json({ status: "error", message: error });
  }
}
