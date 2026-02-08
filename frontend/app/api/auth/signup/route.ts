// Next.js API route for signup - proxies to backend

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Call backend signup endpoint
    const res = await fetch(`${BACKEND_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.detail || "Sign up failed" }, { status: res.status });
    }

    // Create response and clear signed-out flag
    const response = NextResponse.json({ success: true, user: data.user });

    // Set session cookie with token from backend
    if (data.token) {
      response.cookies.set("session", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
    }

    // Clear signed-out flag
    response.cookies.delete("signed-out");

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
