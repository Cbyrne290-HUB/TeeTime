"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flag, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) { setError("Invalid email or password"); setLoading(false); }
    else router.push("/");
  }

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #064e3b 100%)" }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-96 h-96 rounded-full left-[-10%] top-[-10%] orb-a"
            style={{ background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)" }} />
          <div className="absolute w-72 h-72 rounded-full right-0 bottom-0 orb-b"
            style={{ background: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)" }} />
        </div>
        <div className="relative text-center text-white">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-900/50">
            <Flag className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-black mb-3">TeeTime Ireland</h2>
          <p className="text-emerald-200 text-lg max-w-xs mx-auto leading-relaxed">Book visitor tee times at the best golf clubs across Ireland</p>
          <div className="mt-10 grid grid-cols-3 gap-6 text-center">
            {[["50+", "Golf clubs"], ["€0", "Booking fee"], ["2 min", "To book"]].map(([v, l]) => (
              <div key={l}>
                <div className="text-2xl font-black text-emerald-300">{v}</div>
                <div className="text-xs text-gray-400 mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-md">
          <div className="glass rounded-3xl p-8 shadow-2xl">
            <h1 className="text-2xl font-black text-white mb-1">Welcome back</h1>
            <p className="text-gray-400 text-sm mb-7">Sign in to your account to manage bookings</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/8 border border-white/12 rounded-xl pl-10 pr-3 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="you@example.com" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input required type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/8 border border-white/12 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-2.5 text-red-400 text-sm">{error}</div>
              )}

              <button type="submit" disabled={loading}
                className="btn-gold w-full text-white font-black py-3.5 rounded-xl text-sm disabled:opacity-60 mt-2">
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              No account?{" "}
              <Link href="/register" className="text-emerald-400 font-semibold hover:text-emerald-300">Create one free</Link>
            </p>

            <div className="mt-4 pt-4 border-t border-white/8 text-xs text-gray-600 text-center">
              Demo: <span className="text-gray-400">golfer@test.com / password123</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
