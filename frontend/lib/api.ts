import type {
  ConversationRespondResponse,
  ConversationStartResponse,
  CreateProfileRequest,
  UserProfile,
} from "@/lib/types";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

if (!API_BASE) {
  // This must be configured in .env.local
  // Example: NEXT_PUBLIC_API_URL=http://localhost:3001
  throw new Error("NEXT_PUBLIC_API_URL is not set");
}

async function handleJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function getUserProfile(token: string): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/api/users/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 404) {
    let message = "PROFILE_NOT_FOUND";
    try {
      const body = await res.json();
      if (typeof body?.message === "string") {
        message = "PROFILE_NOT_FOUND";
      }
    } catch {
      // ignore JSON parse errors and use default message
    }

    const err: any = new Error(message);
    err.code = "PROFILE_NOT_FOUND";
    throw err;
  }

  const data = await handleJson<{ success: boolean; user: UserProfile }>(res);
  return data.user;
}

export async function completeUserProfile(
  token: string,
  payload: CreateProfileRequest,
): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/api/users/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await handleJson<{
    success: boolean;
    user: UserProfile;
    is_new_user?: boolean;
  }>(res);

  return data.user;
}

export async function startConversation(
  token: string,
  userId: string,
): Promise<ConversationStartResponse> {
  const res = await fetch(`${API_BASE}/api/conversation/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ user_id: userId }),
  });

  const json = await handleJson<any>(res);
  const data = json.data ?? json;
  return data as ConversationStartResponse;
}

export async function sendConversationResponse(
  token: string,
  params: { sessionId: string; userId: string; message: string },
): Promise<ConversationRespondResponse> {
  const res = await fetch(`${API_BASE}/api/conversation/respond`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      session_id: params.sessionId,
      user_id: params.userId,
      user_message: params.message,
    }),
  });
  const json = await handleJson<any>(res);
  const data = json.data ?? json;

  return {
    ...data,
    recommendations: data.recommendations ?? data.total_recommendations,
    total_matches: data.total_matches ?? data.matches,
  } as ConversationRespondResponse;
}
