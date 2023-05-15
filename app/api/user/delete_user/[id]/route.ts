import { findOneAndDelete } from "@/utils/user/user";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  try {
    const id = params.id;
    await findOneAndDelete({ id: id });
    return NextResponse.json({ status: "success", message: "User Deleted" });
  } catch (error) {
    return NextResponse.json({ status: "error", message: error });
  }
}
