// Next.js API route for tasks - proxies to backend

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://anas-khan09-todo-backend.hf.space";

export async function GET(request: NextRequest) {
  try {
    // Get session token
    const sessionToken = request.cookies.get("session")?.value;

    const url = new URL(request.url);
    const queryString = url.search;

    // Forward request to backend
    const res = await fetch(`${BACKEND_URL}/api/tasks${queryString}`, {
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
    console.error("Tasks GET error:", error);
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session")?.value;
    const body = await request.json();

    console.log('[Tasks POST] Creating task with session:', sessionToken ? 'yes' : 'no');

    const res = await fetch(`${BACKEND_URL}/api/tasks`, {
      method: "POST",
      headers: {
        ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log('[Tasks POST] Response status:', res.status);

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: res.statusText }));
      console.error('[Tasks POST] Error:', error);
      return NextResponse.json(error, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Tasks POST error:", error);
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 }
    );
  }
}
