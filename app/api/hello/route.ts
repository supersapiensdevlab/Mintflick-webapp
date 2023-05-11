import { MONGO_CONFIG } from "@/services/config.service";
import { NextResponse } from "next/server";

type Data = {
  token: string;
  expiresIn: number;
};

export async function GET(
  request: Request
) {
  return NextResponse.json({ token: "asas", expiresIn: 3600 })
}
