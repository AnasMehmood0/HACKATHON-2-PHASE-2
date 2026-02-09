// Next.js API route for session check

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || "http://localhost:8000";

export async function GET(request: NextRequest) {
  try {
    // Check if user has explicitly signed out
    const signedOut = request.cookies.get("signed-out")?.value;

    if (signedOut === "true") {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Get session cookie
    const sessionToken = request.cookies.get("session")?.value;

    if (!sessionToken) {
      // In dev mode, return dev user (only if not signed out)
      if (process.env.NODE_ENV === "development") {
        return NextResponse.json({
          user: { id: "dev-user-123", email: "dev@example.com" },
        });
      }

      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Verify session with backend
    const res = await fetch(`${BACKEND_URL}/api/auth/session`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    // In dev mode, return dev user (only if not signed out)
    const signedOut = request.cookies.get("signed-out")?.value;
    if (process.env.NODE_ENV === "development" && signedOut !== "true") {
      return NextResponse.json({
        user: { id: "dev-user-123", email: "dev@example.com" },
      });
    }

    return NextResponse.json({ user: null }, { status: 401 });
  }
}
