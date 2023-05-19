import { findFeed } from "@/utils/feed/feed";
import { NextResponse } from "next/server";
import { Feed } from "@/utils/models/feed.model";

export async function GET(request: Request) {
  try {
    const LIMIT = 10;
    Feed.find({})
      .sort({ _id: -1 })
      .limit(LIMIT)
      .then((feed) => {
        return NextResponse.json({
          status: "success",
          message: "Feed fetched successfully",
          data: feed,
        });
      })
      .catch((err) => {
        return NextResponse.json({ status: "error", message: err });
      });
  } catch (error) {
    return NextResponse.json({ status: "error", message: error });
  }
}
