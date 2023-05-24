import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import axios from "axios";
import { CREATE_ROOM_CONFIG } from "@/services/config.service";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const title: string = req.title;
    const hostWallets: string = req.hostWallets;
    await axios
      .post(
        "  https://us-central1-nfts-apis.cloudfunctions.net/createroom",
        {
          title: title,
          hostWallets: hostWallets,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": CREATE_ROOM_CONFIG.xApikey,
          },
        }
      )
      .then((response) => {
        return NextResponse.json({
          status: "success",
          message: "Room created successfully",
          data: response.data,
        });
      })
      .catch(function (error) {
        return NextResponse.json({ status: "error", message: error });
      });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
