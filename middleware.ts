import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticated } from "./utils/middleware/userMiddleware";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Call our authentication function to check the request
  console.log(isAuthenticated(request));
  if (!isAuthenticated(request)) {
    // Respond with JSON indicating an error message
    return new NextResponse(
      JSON.stringify({ success: false, message: "authentication failed" }),
      { status: 401, headers: { "content-type": "application/json" } }
    );
  }
}

export const config = {
  matcher: "/api/user/follow",
};
