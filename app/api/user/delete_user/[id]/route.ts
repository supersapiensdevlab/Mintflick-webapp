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
    const id: string = params.id;
    const deleteUser = await findOneAndDelete({ id: id });
    if (!deleteUser.success) {
      return NextResponse.json({ status: "error", message: deleteUser.error });
    }
    return NextResponse.json({
      status: "success",
      message: "User Deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ status: "error", message: error });
  }
}
