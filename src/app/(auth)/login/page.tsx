"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/auth/auth-provider";
import { useRouter } from "next/navigation";
import { ADMIN } from "@/lib/constants";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-dvh items-center justify-center bg-forest-deep px-6 py-16">
      <div className="w-full max-w-[420px] rounded-[18px] border border-line bg-white p-8 shadow-[var(--shadow-lg)]">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 grid size-[60px] place-items-center rounded-full bg-cream-deep font-heading text-xl font-bold text-forest">
            D
          </div>
          <h1 className="text-[28px] font-semibold">Admin Login</h1>
          <p className="text-sm text-muted">{ADMIN.subtitle}</p>
        </div>

        {error && (
          <div className="mb-4 rounded-[10px] bg-badge-red-bg px-4 py-3 text-sm font-bold text-badge-red-text">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="mb-2 block text-[13px] font-bold text-forest">
              Email / Username
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-[10px] border-[1.5px] border-line bg-white px-4 py-[13px] text-sm outline-none focus:border-olive"
              placeholder="admin@denisco.com"
              required
            />
          </div>
          <div className="mb-5">
            <label className="mb-2 block text-[13px] font-bold text-forest">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-[10px] border-[1.5px] border-line bg-white px-4 py-[13px] text-sm outline-none focus:border-olive"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-forest px-7 py-[15px] text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-olive disabled:cursor-not-allowed disabled:opacity-45"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="mt-4 rounded-[10px] bg-cream-deep p-3 text-center text-xs text-muted">
          <strong>Demo:</strong> admin@denisco.com / admin123
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          <a
            href={ADMIN.webUrl}
            className="font-bold text-olive hover:text-forest"
          >
            ← Back to Website
          </a>
        </p>
      </div>
    </section>
  );
}
