import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { comparePassword } from "@/lib/auth";
import { createSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const { data: user, error: queryError } = await supabase
      .from("travel_wishlist_app_axepz_users")
      .select("id, password_hash")
      .eq("email", email.toLowerCase())
      .single();

    if (queryError || !user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const passwordMatch = await comparePassword(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const sessionToken = await createSession(user.id);

    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );

    response.cookies.set("auth_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
