import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://anas-khan09-todo-backend.hf.space";

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
    // Get the actual redirect URI that Google used
    const redirectUri = `${request.nextUrl.protocol}//${request.nextUrl.host}/api/auth/callback/google`;

    // Exchange code for tokens with backend
    const response = await fetch(`${BACKEND_URL}/api/auth/oauth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, state, redirect_uri: redirectUri }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "OAuth exchange failed" }));
      throw new Error(errorData.detail || "Failed to exchange OAuth code");
    }

    const data = await response.json();

    // Set session cookie and redirect
    const redirectUrl = new URL("/dashboard", request.url);
    const nextResponse = NextResponse.redirect(redirectUrl);

    // Set session cookie from backend
    if (data.sessionToken) {
      nextResponse.cookies.set("session", data.sessionToken, {
        httpOnly: true,
        secure: true,
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
