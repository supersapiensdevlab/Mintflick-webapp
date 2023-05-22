import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOne, findOneAndUpdate } from "@/utils/user/user";
import { makeid } from "@/utils/makeId/makeId";
import { limitCheck } from "@/utils/user/user";
import { updateOne } from "@/utils/user/user";
import { Feed } from "@/utils/models/feed.model";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();

    let tagged = req.tagged;
    const announcement = req.announcement;
    let linkData = {};
    if (req.previewData) {
      linkData = JSON.parse(req.previewData);
    }
    const tokenId = req.tokenId;

    console.log(tokenId);

    let post_image = null;
    let post_video = null;

    if (req) {
      post_image = req.postImage;
      post_video = req.postVideo;
    }

    const link = req.eventlink;
    const uploadHash = req.announcementHash ? req.announcementHash : null;

    const { success, user, error } = await findOne({ _id: req.user_id });
    if (!success) {
      return NextResponse.json({ status: "error", message: error });
    }

    if (tokenId) {
      const check = await limitCheck(user.username);
      if (!check.status) {
        return NextResponse.json({ status: "error", message: "" });
      }
    }

    let postImg, postVid;

    if (post_video) {
      postVid =
        "https://nftstorage.link/ipfs/" + uploadHash + "/" + post_video.name;
    }
    if (post_image) {
      postImg =
        "https://nftstorage.link/ipfs/" + uploadHash + "/" + post_image.name;
    }
    const postId = makeid(7);
    const announcementData = {
      postId: postId,
      announcement: announcement,
      post_image: postImg ? postImg : null,
      post_video: postVid ? postVid : null,
      link: `/homescreen/profile/${user.username}/posts`,
      time: Math.floor(Date.now() / 1000),
      tokenId: tokenId,
      username: user.username,
      linkpreview_data: linkData,
    };

    const notificationAnnouncementData = {
      postId: postId,
      announcement: tokenId
        ? `${user.username} minted a new NFT`
        : `${user.username} uploaded a new photo`,
      post_image: postImg ? postImg : null,
      post_video: postVid ? postVid : null,
      link: `/homescreen/${user.username}/post/${postId}`,
      time: Math.floor(Date.now() / 1000),
      tokenId: tokenId,
      username: user.username,
      linkpreview_data: linkData,
    };

    const feedAnnouncementData = {
      postId: postId,
      announcement: announcement,
      post_image: postImg ? postImg : null,
      post_video: postVid ? postVid : null,
      link: `/homescreen/${user.username}/post/${postId}`,
      time: Math.floor(Date.now() / 1000),
      tokenId: tokenId,
      username: user.username,
      linkpreview_data: linkData,
    };

    const trendValue = {
      user_id: user._id,
      wallet_id: user.wallet_id,
      username: user.username,
      name: user.name,
      profile_image: user.profile_image,
      superfan_data: user.superfan_data,
      content: feedAnnouncementData,
      content_type: "post",
      reports: user.reports,
      superfan_to: user.superfan_to,
    };

    const taggedAnnouncement = {
      postId: postId,
      announcement: `${user.username} tagged you in a post`,
      post_image: postImg ? postImg : null,
      post_video: postVid ? postVid : null,
      link: `/homescreen/${user.username}/post/${postId}`,
      time: Math.floor(Date.now() / 1000),
      tokenId: tokenId,
      username: user.username,
      linkpreview_data: linkData,
    };

    user.follower_count.forEach(async function (id: any) {
      const push = await updateOne(
        { username: id },
        { $push: { notification: notificationAnnouncementData } }
      );
      if (!push.success) {
        return NextResponse.json({ status: "error", message: push.error });
      }
    });

    const push = await updateOne(
      { username: user.username },
      { $push: { posts: announcementData } }
    );
    if (!push.success) {
      return NextResponse.json({ status: "error", message: push.error });
    }

    Feed.insertMany(trendValue);

    if (tagged && tagged.length > 0) {
      if (!Array.isArray(tagged)) {
        tagged = tagged.split(",");
      }
      tagged.forEach(async (value: any) => {
        const push = await updateOne(
          { username: value },
          { $push: { notification: taggedAnnouncement } }
        );
        if (!push.success) {
          return NextResponse.json({ status: "error", message: push.error });
        }
      });
    }

    return NextResponse.json({
      status: "success",
      message: "Post created successfully",
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
