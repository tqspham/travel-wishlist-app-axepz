import { supabase } from "@/lib/supabase";

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

export async function createSession(userId: string): Promise<string> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION).toISOString();
  const token = Buffer.from(
    JSON.stringify({
      userId,
      createdAt: new Date().toISOString(),
      expiresAt,
    })
  ).toString("base64");

  const { error } = await supabase
    .from("travel_wishlist_app_axepz_sessions")
    .insert([
      {
        user_id: userId,
        token,
        expires_at: expiresAt,
      },
    ]);

  if (error) {
    throw new Error("Failed to create session");
  }

  return token;
}

export async function validateSession(token: string): Promise<string | null> {
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString());
    const { userId, expiresAt } = decoded;

    if (new Date(expiresAt) < new Date()) {
      return null;
    }

    const { data, error } = await supabase
      .from("travel_wishlist_app_axepz_sessions")
      .select("user_id")
      .eq("token", token)
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      return null;
    }

    return userId;
  } catch {
    return null;
  }
}

export function extractUserIdFromToken(token: string): string | null {
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString());
    return decoded.userId || null;
  } catch {
    return null;
  }
}
