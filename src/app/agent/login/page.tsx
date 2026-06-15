"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "../../(public)/login/actions";

const initialState: LoginState = {};

export default function AgentLoginPage() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  const inputClass =
    "mt-1.5 w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 transition-colors focus:border-[var(--color-prime-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-prime-gold)]";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-24 sm:px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1
            className="text-2xl font-semibold sm:text-3xl"
            style={{ color: "var(--color-prime-gold)" }}
          >
            Prime Property
          </h1>
          <p className="mt-2 text-sm text-white/70">Portal Agen — Masuk ke akun Anda</p>
        </div>

        <form
          action={formAction}
          className="rounded-xl border border-white/10 p-6 shadow-xl sm:p-8"
          style={{ backgroundColor: "var(--color-prime-black)" }}
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium"
                style={{ color: "var(--color-prime-gold)" }}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="agen@primeproperty.id"
                className={inputClass}
                disabled={isPending}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium"
                style={{ color: "var(--color-prime-gold)" }}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className={inputClass}
                disabled={isPending}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-8 w-full rounded-md px-6 py-3 text-sm font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              backgroundColor: "var(--color-prime-gold)",
              color: "var(--color-prime-black)",
            }}
          >
            {isPending ? "Memproses..." : "Masuk"}
          </button>

          {state.error && (
            <p
              role="alert"
              className="mt-4 rounded-md border border-[var(--color-prime-red)]/30 bg-red-50 px-4 py-3 text-sm text-[var(--color-prime-red)]"
            >
              {state.error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
