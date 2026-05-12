import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("auth_session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "No session" },
        { status: 401 }
      );
    }

    const userId = await validateSession(sessionToken);

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { userId, authenticated: true },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
