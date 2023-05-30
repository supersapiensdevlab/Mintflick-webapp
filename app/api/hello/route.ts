import { MONGO_CONFIG } from "@/services/config.service";
import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";

type Data = {
  token: string;
  expiresIn: number;
};

export async function GET(
  request: Request
) {
  try{
   await conn();
    return NextResponse.json({ token: "asas", expiresIn: 3600 })
  }catch(err){
    return NextResponse.json({ err:err })
  }
  
}
     