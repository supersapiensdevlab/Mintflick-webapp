// import { NextResponse } from "next/server";
// import { conn } from "@/services/mongo.service";
// import { findOneAndUpdate } from "@/utils/user/user";
// import { deleteOneFeed } from "@/utils/feed/feed";

// export async function DELETE(request: Request) {
//   try {
//     await conn();
//     const req = await request.json();
//     const deletPost = await findOneAndUpdate(
//       { _id: req.user_id },
//       { $pull: { posts: req.body } },
//       {}
//     );
//     if (!deletPost.success) {
//       return NextResponse.json({ status: "error", message: deletPost.error });
//     }

//     const deleteFeed = await deleteOneFeed({
//       "content.postId": req.body.postId,
//     });
//     if (!deleteFeed.success) {
//       return NextResponse.json({ status: "error", message: deleteFeed.error });
//     }
//     return NextResponse.json({
//       status: "success",
//       message: "Treasury converted successfully",
//     });
//   } catch (err) {
//     return NextResponse.json({ status: "error", message: err });
//   }
// }
