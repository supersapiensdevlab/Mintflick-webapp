import { NextRequest } from "next/server";

declare module "next/server" {
  export interface NextRequest {
    user_id: string;
  }
}
