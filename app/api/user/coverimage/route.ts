import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOneAndUpdate } from "@/utils/user/user";
import fs from "fs-extra";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const userId: string = req.username;
    const coverImage = req.coverImage;

    const coverImagePath = coverImage.name;

    var coverImageHashLink = null;

    coverImage.mv(coverImagePath, async (err: any) => {
      try {
        const uploadHash = req.imageHash;

        const imageHash = req.coverImage.name;

        coverImageHashLink =
          "https://nftstorage.link/ipfs/" + uploadHash + "/" + imageHash;

        try {
          await fs.remove(coverImagePath);
          console.log("File deleted successfully.");
        } catch (error) {
          console.error("Error deleting file:", error);
        }

        if (coverImageHashLink != null) {
          const update = await findOneAndUpdate(
            { username: userId },
            { $set: { cover_image: coverImageHashLink } },
            {}
          );
          if (!update.success) {
            return NextResponse.json({
              status: "error",
              message: update.error,
            });
          }
          return NextResponse.json({
            status: "success",
            message: "Cover image uploaded successfully",
          });
          //return res.send(coverImageHashLink);
        } else {
          return NextResponse.json({
            status: "error",
            message: "Upload error",
          });
        }
      } catch (err) {
        return NextResponse.json({ status: "error", message: err });
      }
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
