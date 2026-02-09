// Next.js API route for chat - proxies to backend

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://anas-khan09-todo-backend.hf.space";

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session")?.value;
    const body = await request.json();

    console.log("[Chat API] Forwarding request to backend:", { message: body.message?.substring(0, 50) });

    // Build headers - always include Authorization for dev mode compatibility
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add Authorization header - use dummy token for dev mode if no session
    if (sessionToken) {
      headers["Authorization"] = `Bearer ${sessionToken}`;
    } else {
      // For dev mode, send a placeholder that backend will handle
      headers["Authorization"] = `Bearer dev-mode-placeholder`;
    }

    const res = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    console.log("[Chat API] Backend response status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[Chat API] Backend error:", errorText);
      try {
        const error = JSON.parse(errorText);
        return NextResponse.json(error, { status: res.status });
      } catch {
        return NextResponse.json({ detail: res.statusText }, { status: res.status });
      }
    }

    const data = await res.json();
    console.log("[Chat API] Success, conversation_id:", data.conversation_id);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[Chat API] Request failed:", error);
    return NextResponse.json(
      { detail: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}
