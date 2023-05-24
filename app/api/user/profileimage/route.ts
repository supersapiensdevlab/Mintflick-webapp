import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOneAndUpdate } from "@/utils/user/user";
import fs from "fs-extra";
import { updateMany } from "@/utils/feed/feed";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const userId: string = req.username;
    const profileImage = req.profileImage;

    const profileImagePath = profileImage.name;

    var profileImageHashLink = null;

    profileImage.mv(profileImagePath, async (err: any) => {
      try {
        const uploadHash = req.imageHash;

        const imageHash = req.profileImage.name;

        profileImageHashLink =
          "https://nftstorage.link/ipfs/" + uploadHash + "/" + imageHash;

        try {
          await fs.remove(profileImagePath);
          console.log("File deleted successfully.");
        } catch (error) {
          console.error("Error deleting file:", error);
        }

        if (profileImageHashLink != null) {
          const updateFeed = await updateMany(
            { username: userId },
            { $set: { profile_image: profileImageHashLink } }
          );

          if (!updateFeed.success) {
            return NextResponse.json({
              status: "error",
              message: updateFeed.error,
            });
          }

          const update = await findOneAndUpdate(
            { username: userId },
            { $set: { profile_image: profileImageHashLink } },
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
