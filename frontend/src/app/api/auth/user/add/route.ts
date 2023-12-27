import dbConfig from "@/config/dbConfig";
import User from "@/models/User";
import { NextResponse } from "next/server";

interface RequestBody {
  user_id: string | undefined;
  email: string | undefined;
  accessToken: string | undefined;
  refreshToken: string | undefined;
}

export async function POST(req: Request, res: Response) {
  try {
    await dbConfig();
    // get data form request body
    const { accessToken, refreshToken, email, user_id }: RequestBody =
      await req.json();

    // simply validation
    if (!accessToken || !refreshToken || !email || !user_id) {
      return new NextResponse(
        JSON.stringify({
          status: 422,
          message:
            "accessToken , refreshToken , email and user_id is required!",
        })
      );
    }

    const findUser = await User.findOne({ user_id });
    if (findUser) {
      const updatedUser = await User.findByIdAndUpdate(
        findUser._id,
        {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
        { new: true }
      );

      return new NextResponse(
        JSON.stringify({
          status: 200,
          message: "user update successfull",
          user: updatedUser,
        })
      );
    }

    const createUser = await User.create({
      user_id,
      email,
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    return new NextResponse(
      JSON.stringify({
        status: 200,
        message: "user save successfull",
        user: createUser,
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
