import { Connect } from "@/dbconfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helper/mailer";

Connect();

export async function POST(request: NextRequest) {
  try {
    const reqbody = await request.json();
    const { username, email, password } = reqbody;
    console.log(reqbody);

    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json(
        { error: "user already exists" },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashpassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username: username,
      email: email,
      password: hashpassword,
    });

    const savedUser = await newUser.save();
    console.log(savedUser);

    await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

    return NextResponse.json({
      message: "User register successfully",
      success: true,
      savedUser,
    });
  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
