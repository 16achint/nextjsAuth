import { Connect } from "@/dbconfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

Connect();

export async function POST(request: NextRequest) {
  try {
    const resBody = await request.json();
    const { token } = resBody;
    // console.log("token => ", token);

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    // console.log("user => ", user);

    if (!user) {
      return NextResponse.json({ error: "invalid token" }, { status: 400 });
    }
    // console.log("user => ", user);
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    return NextResponse.json(
      { message: "email verified successfully", success: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    let errorMessage = "an unknown error is defined";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
