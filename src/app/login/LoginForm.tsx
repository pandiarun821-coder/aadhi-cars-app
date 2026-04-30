"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CarFront, KeyRound, User, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid username or password");
        setLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-500">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300" htmlFor="username">
            Username
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 py-2.5 pl-11 pr-4 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Enter your username"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 py-2.5 pl-11 pr-4 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="flex justify-end pt-1">
            <Link href="/forgot-password" className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors">
              Forgot Password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group relative w-full overflow-hidden rounded-xl bg-blue-600 py-3 font-medium text-white transition-all hover:bg-blue-500 active:scale-[0.98] disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="mx-auto h-5 w-5 animate-spin" />
          ) : (
            <span className="flex items-center justify-center gap-2">
              Sign In
              <CarFront className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </button>
      </form>
    </motion.div>
  );
}
