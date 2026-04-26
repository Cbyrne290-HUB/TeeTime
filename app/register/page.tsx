"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flag, Mail, Lock, User, Phone, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    });
    if (!res.ok) {
      const d = await res.json();
      setError(d.error ?? "Registration failed");
      setLoading(false);
      return;
    }
    await signIn("credentials", { email, password, redirect: false });
    router.push("/");
  }

  const perks = ["No membership required", "Instant confirmation code", "Free to use — forever", "Manage all bookings in one place"];

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #064e3b 100%)" }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-96 h-96 rounded-full left-[-10%] top-[-10%] orb-a"
            style={{ background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)" }} />
        </div>
        <div className="relative text-white max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-6 shadow-xl shadow-emerald-900/50">
            <Flag className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-black mb-3">Join TeeTime Ireland</h2>
          <p className="text-emerald-200 mb-8">The easiest way to book visitor tee times across the country.</p>
          <ul className="space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm text-gray-300">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-md">
          <div className="glass rounded-3xl p-8 shadow-2xl">
            <h1 className="text-2xl font-black text-white mb-1">Create account</h1>
            <p className="text-gray-400 text-sm mb-7">Free forever — takes under a minute</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input required value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/8 border border-white/12 rounded-xl pl-10 pr-3 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="John Murphy" />
                </div>
              </div>

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
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Phone <span className="text-gray-600 normal-case font-normal">(optional)</span></label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/8 border border-white/12 rounded-xl pl-10 pr-3 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="+353 87 123 4567" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input required type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    className="w-full bg-white/8 border border-white/12 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Min 8 characters" />
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
                className="btn-emerald w-full text-white font-black py-3.5 rounded-xl text-sm disabled:opacity-60 mt-2">
                {loading ? "Creating account…" : "Create Free Account"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{" "}
              <Link href="/login" className="text-emerald-400 font-semibold hover:text-emerald-300">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
