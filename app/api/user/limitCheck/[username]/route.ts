// import { findOneAndDelete } from "@/utils/user/user";
// import { NextResponse } from "next/server";

// export async function GET(
//   request: Request,
//   {
//     params,
//   }: {
//     params: { username: string };
//   }
// ) {
//   try {
//     const username = params.username;
//     const data = {
//         count: callCount[req.params.username]
//       ? callCount[req.params.username]
//       : 0,
//     username: req.params.username,
//     }
//     await findOneAndDelete({ username: username });
//     return NextResponse.json({ status: "success", message: "User Deleted" });
//   } catch (error) {
//     return NextResponse.json({ status: "error", message: error });
//   }
// }
