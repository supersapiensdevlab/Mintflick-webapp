import { NextResponse } from "next/server";
import { Feed } from "@/utils/models/feed.model";

export async function GET(request: Request) {
  try {
    const LIMIT = 10;
    const feed = await Feed.find({}).sort({ _id: -1 }).limit(LIMIT);
    return NextResponse.json({
      status: "success",
      message: "Feed fetched successfully",
      data: feed,
    });
  } catch (error) {
    return NextResponse.json({ status: "error", message: error });
  }
}
