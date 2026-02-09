// Next.js API route for conversations - proxies to backend

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://anas-khan09-todo-backend.hf.space";

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session")?.value;

    const res = await fetch(`${BACKEND_URL}/api/conversations`, {
      headers: {
        ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { detail: res.statusText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Conversations GET error:", error);
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 }
    );
  }
}
