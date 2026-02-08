// Next.js API route for chat - proxies to backend

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session")?.value;
    const body = await request.json();

    const res = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: {
        ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: res.statusText }));
      return NextResponse.json(error, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Chat POST error:", error);
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 }
    );
  }
}
