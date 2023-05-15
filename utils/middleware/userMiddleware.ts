import { MIDDLEWARE_CONFIG } from "@/services/config.service";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const isAuthenticated = (request: NextRequest) => {
  const token = request.headers.get("auth-token");
  console.log(token);
  if (!token) {
    return false;
  }
  try {
    const data: any = jwt.verify(
      JSON.parse(token),
      MIDDLEWARE_CONFIG.JWT_SECRET
    );
    // request.user_id = data.user_id;
    return true;
  } catch (error) {
    return false;
  }
};
