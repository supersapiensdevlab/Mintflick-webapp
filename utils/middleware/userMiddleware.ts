import { MIDDLEWARE_CONFIG } from "@/services/config.service";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const isAuthenticated = (request: NextRequest) => {
  const token: any = request.headers.get("auth-token");
  if (!token) {
    return false;
  }
  try {
    console.log(jwt);
    const data = jwt.verify(
      JSON.stringify(token),
      MIDDLEWARE_CONFIG.JWT_SECRET
    );
    // request.user_id = data.user_id;
    return true;
  } catch (error) {
    return false;
  }
};
