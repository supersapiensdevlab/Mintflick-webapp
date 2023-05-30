import { NextResponse } from "next/server";
import sendgrid from "@sendgrid/mail";
import { SENDGRID_CONFIG } from "@/services/config.service";

export async function POST(request: Request) {
  try {
    sendgrid.setApiKey = SENDGRID_CONFIG.apiKey.toString;
    const req = await request.json();
    const feedback: string = req.feedback;
    const email: string = req.email;
    console.log(feedback);
    await sendgrid.send({
      to: SENDGRID_CONFIG.serviceEmail,
      from: SENDGRID_CONFIG.serviceEmail,
      subject: "User Feedback",
      html: `
            <p>${feedback}</p>
            <p>From : ${email}</p>
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
