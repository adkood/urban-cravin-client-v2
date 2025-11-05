import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { LOGINURL } from "@/lib/urls";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const resp = await axios.post<{
          status : string
          message : string
          token : string
        }>(LOGINURL, body);

    if (resp.data.status?.toLowerCase() === "success") {
      const token = resp.data.token; 

      (await cookies()).set("Authorization","Bearer "+token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return NextResponse.json({ status: resp.data.status, message : resp.data.message });
    }

    return NextResponse.json({ status: resp.data.status, message : resp.data.message }, { status: 401 });
  } catch (err) {
    console.error("Login failed:", err);
    return NextResponse.json({ status: "Error", message : "Something went wrong!!" }, { status: 500 });
  }
}
