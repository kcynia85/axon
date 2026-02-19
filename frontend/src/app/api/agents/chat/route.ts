import { NextRequest } from "next/server";
import { API_BASE_URL, endpoints } from "@/shared/lib/api-client/config";

export async function POST(req: NextRequest) {
  const backendUrl = `${API_BASE_URL}${endpoints.agents.chatStream}`;

  const authorization = req.headers.get("authorization") ?? "";
  const contentType = req.headers.get("content-type") ?? "application/json";

  const body = await req.text();

  const backendResponse = await fetch(backendUrl, {
    method: "POST",
    headers: {
      "Content-Type": contentType,
      Authorization: authorization,
    },
    body,
    cache: "no-store",
  });

  if (!backendResponse.body) {
    return new Response("No SSE body from backend", { status: 502 });
  }

  return new Response(backendResponse.body, {
    status: backendResponse.status,
    headers: {
      "Content-Type": backendResponse.headers.get("content-type") ?? "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

