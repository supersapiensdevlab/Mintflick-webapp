import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOneAndUpdate } from "@/utils/user/user";
import { updateMany } from "@/utils/feed/feed";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const reporter = req.reporter;
    const reported = req.reported;
    const report = req.report;
    const id = req.id;
    const content_type = req.content_type;

    const reportData = {
      reporter: reporter,
      reported: reported,
      report: report,
      id: id,
      reportingTime: Date.now(),
      content_type: content_type,
    };

    const addReport = await findOneAndUpdate(
      { username: reported },
      { $push: { reports: reportData } },
      {}
    );

    if (!addReport.success) {
      return NextResponse.json({ status: "error", message: addReport.error });
    }

    const updateInFeed = await updateMany(
      { username: reported },
      { $push: { reports: reportData } }
    );

    if (!updateInFeed.success) {
      return NextResponse.json({
        status: "error",
        message: updateInFeed.error,
      });
    }
    return NextResponse.json({
      status: "success",
      message: "reported successfully",
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
