"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiClient.post(ENDPOINTS.auth.forgotPassword, { email });
      setSent(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error && err.message === "Failed to fetch"
          ? "Unable to connect to the server. Please try again later."
          : err instanceof Error
            ? err.message
            : "Could not send the reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-dvh items-center justify-center bg-forest-deep px-6 py-16">
      <div className="w-full max-w-[420px] rounded-[18px] border border-line bg-white p-8 shadow-[var(--shadow-lg)]">
        <div className="mb-6 text-center">
          <Image
            src="https://ik.imagekit.io/a8q3rfdl1/DENISCO%20FARM%20MEDIA/Company%20logo.jpeg"
            alt="DENISCO logo"
            width={60}
            height={60}
            className="mx-auto mb-4 size-[60px] rounded-full border border-line bg-white object-cover"
          />
          <h1 className="text-[28px] font-semibold">Forgot Password</h1>
          <p className="text-sm text-muted">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-[10px] bg-badge-red-bg px-4 py-3 text-sm font-bold text-badge-red-text">
            {error}
          </div>
        )}

        {sent ? (
          <div className="rounded-[10px] bg-badge-green-bg px-4 py-5 text-center text-sm font-bold text-badge-green-text">
            If an account with that email exists, a password reset link has
            been sent. Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="fp-email"
                className="mb-2 block text-[13px] font-bold text-forest"
              >
                Email Address
              </label>
              <input
                type="email"
                id="fp-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[10px] border-[1.5px] border-line bg-white px-4 py-[13px] text-sm outline-none focus:border-olive"
                placeholder="admin@denisco.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-forest px-7 py-[15px] text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-olive disabled:cursor-not-allowed disabled:opacity-45"
            >
              {loading ? "Sending…" : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/login" className="font-bold text-olive hover:text-forest">
            ← Back to Login
          </Link>
        </p>
      </div>
    </section>
  );
}
