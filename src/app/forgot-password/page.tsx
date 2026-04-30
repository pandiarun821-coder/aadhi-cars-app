"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to send reset email");

      setStatus("success");
      setMessage("If an account with that email exists, we've sent a password reset link to it.");
    } catch (error: any) {
      setStatus("error");
      setMessage(error.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">Forgot Password</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {status === "success" ? (
          <div className="rounded-lg bg-green-500/10 p-4 text-center">
            <p className="text-sm text-green-400">{message}</p>
            <Link href="/login" className="mt-4 inline-block text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="you@company.com"
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-red-500 text-center">{message}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition-all hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {status === "loading" ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="text-center mt-4">
              <Link href="/login" className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
