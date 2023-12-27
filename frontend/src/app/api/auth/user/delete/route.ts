import dbConfig from "@/config/dbConfig";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, response: Response) {
  try {
    await dbConfig();
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return new NextResponse(
        JSON.stringify({
          status: 403,
          message: "user_id is required on search params",
        })
      );
    }

    const findUser = await User.findOne({ user_id });
    if (!findUser) {
      return new NextResponse(
        JSON.stringify({
          status: 400,
          message: "invalid user_id",
        })
      );
    }

    await User.findByIdAndDelete(findUser._id);

    return new NextResponse(
      JSON.stringify({
        status: 200,
        message: "user delete successfull",
      })
    );
  } catch (error) {
    // console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
