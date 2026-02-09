// Next.js API route for signup - proxies to backend

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Hardcoded backend URL for production
    const BACKEND_URL = "https://anas-khan09-todo-backend.hf.space";

    const body = await request.json();
    const { email, password, name } = body;

    // Call backend signup endpoint
    const res = await fetch(`${BACKEND_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.detail || "Sign up failed" }, { status: res.status });
    }

    // Create response
    const response = NextResponse.json({ success: true, user: data.user });

    // Set session cookie with token from backend
    if (data.token) {
      response.cookies.set("session", data.token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch (error) {
    console.error('[Signup] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
