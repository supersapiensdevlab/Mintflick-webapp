import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOne, updateOne } from "@/utils/user/user";
import { limitCheck } from "@/utils/user/user";
import path from "path";
import fs from "fs-extra";
import { GAMESTOWEB3_CONGIG } from "@/services/config.service";
import { mintNft } from "@/utils/marketplace/gamestoweb3/erc721";
import { Nft } from "@/utils/models/nft.model";

type IData = {
  wallet_address: string;
  contract_address: string;
  token_owner: string;
  image_uri: string;
  name: string;
  description: string;
  attributes: Array<object>;
  external_uri: string;
};

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const isNft: boolean = req.isNft;
    const {
      userName,
      userImage,
      videoName,
      category,
      ratings,
      tags,
      description,
      allowAttribution,
      commercialUse,
      derivativeWorks,
      tokenId,
      id,
    } = req;

    let tagged = req.tagged;
    const userId = req.id;

    const { success, user, error } = await findOne({ id: userId });
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }

    if (tokenId) {
      limitCheck(user.username);
    }
    const reaction = {
      like: [],
      dislike: [],
      angry: [],
      happy: [],
    };
    var currentTimeInSeconds = Math.floor(Date.now() / 1000); //unix timestamp in seconds

    const time = currentTimeInSeconds;

    const { videoImage, videoFile } = req;
    const file = req.videoFile;
    const albumFile = req.videoFile;

    //const albumFile = req.videoImage;

    const fileName = videoFile.name + path.extname(videoFile.name); //path.extname(videoFile.name)
    const filePath = fileName;

    const videoArtPath = videoImage.name;

    var videoHashLink: string = "";
    var albumhashLink = null;
    var meta_url =
      "https://nftstorage.link/ipfs/" + req.meta_url + "/meta.json";

    file.mv(filePath, async (err: any) => {
      try {
        const fileHash = req.videoHash;

        videoHashLink =
          "https://nftstorage.link/ipfs/" + fileHash + "/" + req.videoFile.name;

        try {
          await fs.remove(filePath);
          console.log("File deleted successfully.");
        } catch (error) {
          console.error("Error deleting file:", error);
        }

        // video Uploaded Now Upload AlbumArt

        albumFile.mv(videoArtPath, async (err: any) => {
          try {
            const imageHash = req.videoImage.name;

            albumhashLink =
              "https://nftstorage.link/ipfs/" + fileHash + "/" + imageHash;

            fs.unlink(videoArtPath, (err) => {
              if (err) console.log(err);
            });

            if (
              albumhashLink != null &&
              videoHashLink != null &&
              meta_url != null
            ) {
              try {
                if (isNft) {
                  const mintData: IData = {
                    wallet_address: GAMESTOWEB3_CONGIG.creatorWallet,
                    contract_address: GAMESTOWEB3_CONGIG.erc721Contract,
                    token_owner: user.wallet_address,
                    image_uri: videoHashLink || "",
                    name: videoName || "",
                    description: description || "",
                    attributes: [],
                    external_uri: albumhashLink || "",
                  };
                  const { success, nftData, error } = await mintNft(mintData);
                  if (!success) {
                    return NextResponse.json({
                      success: false,
                      message: error,
                      data: {},
                    });
                  }
                  const nft = new Nft(nftData);
                  await nft.save();
                }
              } catch (error) {
                return NextResponse.json({ status: "error", message: error });
              }
              //   saveVideoToDB(
              //     user.username,
              //     userImage,
              //     videoName,
              //     tokenId,
              //     albumhashLink,
              //     videoHashLink,
              //     meta_url,
              //     category,
              //     ratings,
              //     tags,
              //     description,
              //     allowAttribution,
              //     commercialUse,
              //     derivativeWorks,
              //     time,
              //     reaction,
              //     user
              //   );

              const announcementData = {
                announcement: tokenId
                  ? `${user.username} minted a new video NFT`
                  : `${user.username} uploaded a new video`,
                post_image: userImage ? userImage : null,
                post_video: null,
                link: `/hoemscreen/profile/${user.username}`,
                time: Date.now() / 1000,
                username: user.username,
                linkpreview_data: null,
              };

              const taggedAnnouncement = {
                announcement: `${user.username} tagged you in a video`,
                post_image: userImage ? userImage : null,
                link: `/homescreen/profile/${user.username}`,
                time: Math.floor(Date.now() / 1000),
                tokenId: tokenId,
                username: user.username,
                linkpreview_data: null,
              };

              user.follower_count.forEach(async function (id: string) {
                const push = await updateOne(
                  { username: id },
                  { $push: { notification: announcementData } }
                );
                if (!push.success) {
                  return NextResponse.json({
                    status: "error",
                    message: push.error,
                  });
                }
              });

              if (tagged && tagged.length > 0) {
                if (!Array.isArray(tagged)) {
                  tagged = tagged.split(",");
                }
                tagged.forEach(async (value: string) => {
                  const push = await updateOne(
                    { username: value },
                    { $push: { notification: taggedAnnouncement } }
                  );
                  if (!push.success) {
                    return NextResponse.json({
                      status: "error",
                      message: push.error,
                    });
                  }
                });
              }

              return NextResponse.json({
                status: "success",
                message: "Video uploaded successfully",
              });
            } else {
              //console.log('ERRRRRRRRRRRRRRRR');

              return NextResponse.json({ status: "error", message: "Error" });
            }
          } catch (error) {
            console.log(error);
          }
        });

        if (err) {
          //console.log('Error : failed to Upload the Video File');
          return NextResponse.json({
            status: "error",
            message: "Failed to upload file",
          });
        }
      } catch (error) {
        console.log(error);
      }
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
