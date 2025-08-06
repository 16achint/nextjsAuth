import { Connect } from "@/dbconfig/dbConfig";
import { NextResponse } from "next/server";

Connect();

export async function GET() {
  try {
    const response = NextResponse.json(
      { message: "login successFully", success: true },
      { status: 200 }
    );

    response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });

    return response;

    return response;
  } catch (error: unknown) {
    let errorMessage = "an unknown error is defined";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
