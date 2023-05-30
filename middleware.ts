import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticated } from "./utils/middleware/userMiddleware";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Call our authentication function to check the request
  const authentication = await isAuthenticated(request);
  if (!authentication) {
    // Respond with JSON indicating an error message
    return new NextResponse(
      JSON.stringify({ success: false, message: "authentication failed" }),
      { status: 401, headers: { "content-type": "application/json" } }
    );
  }
}

export const config = {
  matcher: [
    "/api/user/follow",
    "/api/user/send_feedback",
    "/api/user/send_mail",
    "/api/user/coverimage",
    "/api/user/profileimage",
    "/api/user/update",
    "/api/user/updateUser",
    "/api/user/update-superfan",
    "/api/user/unfollow",
    "/api/user/send_gems",
    "/api/user/convert_treasury",
    "/api/user/nft-notification",
    "/api/user/superfan",
    "/api/user/buyPlan",
    "/api/user/upload_video",
    "/api/user/announcement",
    "/api/user/add_tokenid",
    "/api/user/seennotification",
    "/api/user/preference",
    "/api/user/views",
    "/api/user/postreactions",
    "/api/user/pollreactions",
    "/api/user/videoreactions",
    "/api/user/pollVote",
    "/api/user/uploadThumbnail",
    "/api/user/addcomment",
    "/api/user/likecomment",
    "/api/user/commentdelete",
    "/api/user/commentedit",
    "/api/user/uploadStreamLink",
    "/api/user/deleteStreamLink",
    "/api/user/streamDetails",
    "/api/user/streamSchedule",
    "/api/user/disableComments",
    "/api/user/addpoll",
    "/api/user/update_superfanplans",
    "/api/user/withdraw",
    "/api/user/addevent",
    "/api/user/verifyTicket",
    "/api/user/bookTicket",
    "/api/user/questStart",
  ],
};
