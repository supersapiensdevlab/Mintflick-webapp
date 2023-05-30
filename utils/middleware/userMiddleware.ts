import { MIDDLEWARE_CONFIG } from "@/services/config.service";
import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

const getJwtSecretKey = () => {
  const secret = MIDDLEWARE_CONFIG.JWT_SECRET;
  if (!secret || secret.length === 0) {
    throw new Error("JWT secret key unaivailable");
  }
  return secret;
};

const verifyToken = async (token: string) => {
  try {
    const decoded = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecretKey())
    );
    return decoded.payload;
  } catch (error) {
    console.log(error);
    return null; // Invalid token or token expired
  }
};

export const isAuthenticated = async (
  request: NextRequest
): Promise<Boolean> => {
  const token = request.headers.get("auth-token");
  if (!token) return false;
  try {
    const decodedToken: any = await verifyToken(token);

    if (!decodedToken) {
      return false;
    }
    request.user_id = decodedToken;
    return true;
  } catch (error) {
    return false;
  }
};
