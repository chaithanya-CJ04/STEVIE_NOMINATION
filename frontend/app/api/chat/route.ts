export const runtime = "nodejs";

function sseResponse(payloads: Array<Record<string, unknown>>): Response {
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const payload of payloads) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(payload)}\n\n`),
        );
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

export async function POST(req: Request): Promise<Response> {
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

  if (!apiBase) {
    return sseResponse([
      { type: "error", message: "NEXT_PUBLIC_API_URL is not set" },
      { type: "done" },
    ]);
  }

  // Extract authorization header
  const authHeader = req.headers.get("Authorization");

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  const sessionId = body?.session_id;
  const message = body?.message;

  if (typeof sessionId !== "string" || !sessionId.trim()) {
    return sseResponse([
      { type: "error", message: "Invalid session_id" },
      { type: "done" },
    ]);
  }

  if (typeof message !== "string" || !message.trim()) {
    return sseResponse([
      { type: "error", message: "Invalid message" },
      { type: "done" },
    ]);
  }

  let upstream: Response;
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    };

    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    upstream = await fetch(`${apiBase}/api/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify({ session_id: sessionId, message }),
    });
  } catch {
    return sseResponse([
      { type: "error", message: "Failed to reach chat service" },
      { type: "done" },
    ]);
  }

  if (!upstream.ok || !upstream.body) {
    const message = await upstream.text().catch(() => "");
    return sseResponse([
      {
        type: "error",
        message: message || `Chat service error (${upstream.status})`,
      },
      { type: "done" },
    ]);
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
