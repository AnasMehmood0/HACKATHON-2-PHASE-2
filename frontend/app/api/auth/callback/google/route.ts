import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // Handle OAuth errors
  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/login?error=missing_oauth_params", request.url)
    );
  }

  try {
    // Exchange code for tokens with backend
    const response = await fetch("http://localhost:8000/api/auth/oauth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, state }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "OAuth exchange failed" }));
      throw new Error(errorData.detail || "Failed to exchange OAuth code");
    }

    const data = await response.json();

    // Set session cookie
    const redirectUrl = new URL("/dashboard", request.url);
    const nextResponse = NextResponse.redirect(redirectUrl);

    // Set session cookie from backend
    if (data.sessionToken) {
      nextResponse.cookies.set("better-auth.session_token", data.sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      });
    }

    return nextResponse;
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error instanceof Error ? error.message : "OAuth failed")}`, request.url)
    );
  }
}
