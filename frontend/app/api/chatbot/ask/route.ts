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

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  const question = body?.question;

  if (typeof question !== "string" || !question.trim()) {
    return sseResponse([
      { type: "error", message: "Invalid question" },
      { type: "done" },
    ]);
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${apiBase}/api/chatbot/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({ question }),
    });
  } catch {
    return sseResponse([
      { type: "error", message: "Failed to reach chatbot service" },
      { type: "done" },
    ]);
  }

  if (!upstream.ok || !upstream.body) {
    const message = await upstream.text().catch(() => "");
    return sseResponse([
      {
        type: "error",
        message: message || `Chatbot service error (${upstream.status})`,
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
