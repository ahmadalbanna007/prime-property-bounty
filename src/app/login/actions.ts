"use server";

import { createApiClient, createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const WINDOW_MS = 30 * 60 * 1000;
const LOCK_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export type LoginState = {
  error?: string;
};

async function getLoginAttempt(email: string) {
  const supabase = createApiClient();
  const { data, error } = await supabase
    .from("login_attempts")
    .select("email, attempts, last_attempt")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function isAccountLocked(email: string): Promise<boolean> {
  const record = await getLoginAttempt(email);
  if (!record) return false;

  const lastAttempt = new Date(record.last_attempt);
  const now = Date.now();

  if (now - lastAttempt.getTime() > WINDOW_MS) {
    const supabase = createApiClient();
    await supabase.from("login_attempts").delete().eq("email", email);
    return false;
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    const lockExpires = lastAttempt.getTime() + LOCK_MS;
    if (now < lockExpires) {
      return true;
    }

    const supabase = createApiClient();
    await supabase.from("login_attempts").delete().eq("email", email);
    return false;
  }

  return false;
}

async function recordFailedLogin(email: string) {
  const supabase = createApiClient();
  const record = await getLoginAttempt(email);
  const now = new Date().toISOString();

  if (!record) {
    await supabase.from("login_attempts").insert({ email, attempts: 1 });
    return;
  }

  const lastAttempt = new Date(record.last_attempt);
  const withinWindow = Date.now() - lastAttempt.getTime() <= WINDOW_MS;

  if (!withinWindow) {
    await supabase
      .from("login_attempts")
      .update({ attempts: 1, last_attempt: now })
      .eq("email", email);
    return;
  }

  await supabase
    .from("login_attempts")
    .update({
      attempts: record.attempts + 1,
      last_attempt: now,
    })
    .eq("email", email);
}

async function clearLoginAttempts(email: string) {
  const supabase = createApiClient();
  await supabase.from("login_attempts").delete().eq("email", email);
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  try {
    if (await isAccountLocked(email)) {
      return { error: "Akun terkunci sementara selama 15 menit." };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      await recordFailedLogin(email);

      if (await isAccountLocked(email)) {
        return { error: "Akun terkunci sementara selama 15 menit." };
      }

      return { error: "Email atau password salah." };
    }

    await clearLoginAttempts(email);
  } catch {
    return { error: "Terjadi kesalahan saat login. Silakan coba lagi." };
  }

  redirect("/dashboard");
}
