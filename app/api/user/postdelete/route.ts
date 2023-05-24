import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOneAndUpdate } from "@/utils/user/user";
import { deleteOneFeed } from "@/utils/feed/feed";

export async function DELETE(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const toDelete: object = req.toDelete;

    if (req.body.postId) {
      const deleteOne = await findOneAndUpdate(
        { _id: req.user_id },
        { $pull: { posts: toDelete } },
        {}
      );
      if (!deleteOne.success) {
        return NextResponse.json({ status: "error", message: deleteOne.error });
      }
      const deleteFeed = await deleteOneFeed({
        "content.postId": req.body.postId,
      });
      if (!deleteFeed.success) {
        return NextResponse.json({
          status: "error",
          message: deleteFeed.error,
        });
      }
      return NextResponse.json({
        status: "success",
        message: "Post deleted sucessfully",
      });
    } else if (req.body.trackId) {
      const deleteOne = await findOneAndUpdate(
        { _id: req.user_id },
        { $pull: { tracks: toDelete } },
        {}
      );
      if (!deleteOne.success) {
        return NextResponse.json({ status: "error", message: deleteOne.error });
      }
      const deleteFeed = await deleteOneFeed({
        "content.trackId": req.body.trackId,
      });
      if (!deleteFeed.success) {
        return NextResponse.json({
          status: "error",
          message: deleteFeed.error,
        });
      }
      return NextResponse.json({
        status: "success",
        message: "Post deleted sucessfully",
      });
    } else if (req.body.videoId) {
      const deleteOne = await findOneAndUpdate(
        { _id: req.user_id },
        { $pull: { videos: toDelete } },
        {}
      );

      const deleteFeed = await deleteOneFeed({
        "content.videoId": req.body.videoId,
      });
      if (!deleteFeed.success) {
        return NextResponse.json({
          status: "error",
          message: deleteFeed.error,
        });
      }
      return NextResponse.json({
        status: "success",
        message: "Post deleted sucessfully",
      });
    } else if (req.body.pollId) {
      const deleteOne = await findOneAndUpdate(
        { _id: req.user_id },
        { $pull: { polls: toDelete } },
        {}
      );

      const deleteFeed = await deleteOneFeed({
        "content.pollId": req.body.pollId,
      });
      if (!deleteFeed.success) {
        return NextResponse.json({
          status: "error",
          message: deleteFeed.error,
        });
      }
      return NextResponse.json({
        status: "success",
        message: "Post deleted sucessfully",
      });
    }
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
