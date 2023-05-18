import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOneAndUpdate } from "@/utils/user/user";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const reporter = req.reporter;
    const reported = req.reported;
    const report = req.report;
    const id = req.id;

    const reportData = {
      reporter: reporter,
      reported: reported,
      report: report,
      id: id,
      reportingTime: Date.now(),
    };

    const addReport = await findOneAndUpdate(
      { username: reported },
      { $push: { reports: reportData } },
      {}
    );
    if (!addReport.success) {
      return NextResponse.json({ status: "error", message: addReport.error });
    }
    return NextResponse.json({
      status: "success",
      message: "Video reported successfully",
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
