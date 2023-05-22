import { NextResponse } from "next/server";
import sendgrid from "@sendgrid/mail";
import { SENDGRID_CONFIG } from "@/services/config.service";

export async function POST(request: Request) {
  try {
    sendgrid.setApiKey = SENDGRID_CONFIG.apiKey.toString;
    const req = await request.json();
    const content = req.HTMLContent;
    const recipient = req.recipient;
    const subject = req.subject;
    await sendgrid.send({
      to: recipient,
      from: SENDGRID_CONFIG.serviceEmail,
      subject: subject,
      html: `${content}
                `,
    });
    return NextResponse.json({
      status: "success",
      message: "Mail sent successfully",
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
