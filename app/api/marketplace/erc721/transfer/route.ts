import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";

export async function GET(request: Request) {
  try {
    await conn();
    return NextResponse.json({ token: "asas", expiresIn: 3600 });
  } catch (err) {
    return NextResponse.json({ err: err });
  }
}
