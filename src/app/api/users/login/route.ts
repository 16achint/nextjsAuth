import { Connect } from "@/dbconfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
Connect();

export async function POST(request: NextRequest) {
  try {
    const reqbody = await request.json();
    const { email, password } = reqbody;
    console.log(reqbody);

    const user = await User.findOne(email);
    if (!user) {
      return NextResponse.json({ error: "user not found" }, { status: 400 });
    }
    console.log("user exists");

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { message: "password does not match" },
        { status: 400 }
      );
    }
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    // if (!process.env.TOKEN_SECRET) {
    //   throw new Error("TOKEN_SECRET environment variable is not defined");
    // }
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET as string, {
      expiresIn: "1h",
    });

    const response = NextResponse.json(
      { message: "login successFully", token: token, success: true },
      { status: 200 }
    );

    response.cookies.set("token", token, { httpOnly: true });

    return response;
  } catch (error: unknown) {
    let errorMessage = "an unknown error is defined";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
