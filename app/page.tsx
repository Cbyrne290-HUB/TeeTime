"use client";
import dynamic from "next/dynamic";
import { SearchForm } from "@/components/SearchForm";
import { Logo } from "@/components/Logo";
import { motion } from "framer-motion";
import { ChevronRight, Quote, Shield, Zap, BarChart3, Users, Clock, Star, Award, CheckCircle, Phone } from "lucide-react";

const HeroScene = dynamic(() => import("@/components/HeroScene").then(m => m.HeroScene), { ssr: false });

// ── Data ──────────────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote: "TeeTime Ireland has transformed how we handle visitor bookings. Our pro shop no longer spends hours on the phone — slots fill automatically, and the quality of visitor we attract has noticeably improved.",
    name: "Ciarán Doherty",
    title: "Club Secretary, Portmarnock Golf Club",
    initials: "CD",
    color: "from-blue-600 to-indigo-700",
  },
  {
    quote: "We were sceptical at first — as a links club we're very protective of our member experience. But the platform's exclusivity controls are exactly right. We decide which slots are open to visitors, at what price.",
    name: "Siobhán O'Brien",
    title: "General Manager, Lahinch Golf Club",
    initials: "SO",
    color: "from-emerald-600 to-teal-700",
  },
  {
    quote: "Within three months of joining, visitor green fee revenue was up 34%. The reporting dashboard alone has saved my team considerable administrative time every week.",
    name: "Pádraig Whelan",
    title: "Director of Golf, Druids Glen Resort",
    initials: "PW",
    color: "from-amber-600 to-orange-700",
  },
];

const PARTNER_CLUBS = [
  "The K Club", "Portmarnock", "Royal Dublin", "Lahinch",
  "Ballybunion", "Old Head Links", "Adare Manor", "Mount Juliet",
  "Druids Glen", "Powerscourt", "Royal Portrush", "Doonbeg",
];

const CLUB_FEATURES = [
  { icon: Zap, title: "Zero daily admin", desc: "Set your schedule once. Slots generate automatically for the next 30 days — no daily updates, no spreadsheets." },
  { icon: Shield, title: "Full club control", desc: "You decide which times are available to visitors, at what price, and with what restrictions. Your club, your rules." },
  { icon: BarChart3, title: "Real-time reporting", desc: "Live dashboard showing bookings, revenue, occupancy and visitor patterns. Export for your committee reports." },
  { icon: Users, title: "Qualified visitors only", desc: "Golfers provide verified contact details at booking. No more no-shows — every visitor is accountable." },
];

const STATS = [
  { value: "21+", label: "Partner Clubs", sub: "and growing" },
  { value: "€0", label: "Setup Cost", sub: "forever free to join" },
  { value: "2 min", label: "Average booking time", sub: "for visitors" },
  { value: "34%", label: "Avg. revenue uplift", sub: "in first 90 days" },
];

const STANDARDS = [
  "Exclusive to registered Irish golf clubs",
  "Visitor vetting at point of booking",
  "No last-minute cancellation abuse",
  "Club branding preserved throughout",
  "Dedicated club relationship manager",
  "GDPR-compliant data handling",
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #060d1a 0%, #0a1a0a 45%, #080d1a 100%)" }}>

        {/* Three.js scene */}
        <HeroScene />

        {/* Subtle vignette overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(6,13,26,0.75) 100%)" }} />

        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-8"
          style={{ backgroundImage: "linear-gradient(rgba(245,158,11,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(245,158,11,0.05) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        {/* Live badge */}
        <div className="absolute top-6 right-6 hidden xl:flex items-center gap-2 glass rounded-full px-4 py-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 badge-pulse" />
          <span className="text-emerald-300 text-xs font-semibold tracking-wide">LIVE AVAILABILITY</span>
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-3xl mx-auto px-4 py-28 text-center w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 border border-amber-500/30 bg-amber-500/8 rounded-full px-5 py-2 mb-8">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300 text-sm font-semibold tracking-wide">Ireland&apos;s Premier Golf Booking Platform</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-5 leading-[1.02] tracking-tight">
              Tee times at Ireland&apos;s{" "}
              <span className="gradient-text">finest courses</span>
              <br />in minutes
            </h1>
            <p className="text-gray-400 text-lg sm:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
              No membership. No phone calls. No waiting. Book a visitor tee time at any of our 21+ partner clubs — instantly.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/6">
              <SearchForm />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="mt-8 flex items-center justify-center gap-8 text-sm flex-wrap">
            {STATS.slice(0, 3).map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="text-gray-500 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-gray-600 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-gray-600 to-transparent" />
        </motion.div>
      </section>

      {/* ── PARTNER CLUBS STRIP ───────────────────────────────────────────── */}
      <section className="py-6 border-y border-slate-800 overflow-hidden"
        style={{ background: "#090f1a" }}>
        <div className="flex items-center gap-2 mb-3 px-8">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span className="text-gray-500 text-xs font-semibold tracking-widest uppercase">Trusted by Ireland&apos;s finest clubs</span>
        </div>
        <div className="flex gap-6 px-8 flex-wrap">
          {PARTNER_CLUBS.map((club) => (
            <span key={club} className="text-gray-400 text-sm font-medium whitespace-nowrap hover:text-amber-400 transition-colors cursor-default">
              {club}
            </span>
          ))}
        </div>
      </section>

      {/* ── SEARCH QUICK LINKS ────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-8">
            <span className="text-amber-500 font-bold text-xs uppercase tracking-widest">Browse by location</span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">Where would you like to play?</h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: "Dublin", lat: 53.3498, lng: -6.2603, emoji: "🏙️" },
              { name: "Kerry", lat: 52.1545, lng: -9.5669, emoji: "🌊" },
              { name: "Clare", lat: 52.9036, lng: -9.0000, emoji: "🏔️" },
              { name: "Cork", lat: 51.8985, lng: -8.4756, emoji: "⛳" },
              { name: "Antrim", lat: 55.0000, lng: -6.5000, emoji: "🌅" },
              { name: "Galway", lat: 53.2707, lng: -9.0568, emoji: "🍀" },
            ].map((loc, i) => {
              const today = new Date().toISOString().split("T")[0];
              return (
                <motion.a key={loc.name}
                  href={`/search?lat=${loc.lat}&lng=${loc.lng}&location=${loc.name}&date=${today}&radius=80&players=2`}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="group flex flex-col items-center gap-2 border-2 border-slate-100 hover:border-amber-400 rounded-2xl py-5 px-3 transition-all duration-200 hover:shadow-lg hover:shadow-amber-100 cursor-pointer">
                  <span className="text-3xl">{loc.emoji}</span>
                  <span className="font-bold text-slate-700 group-hover:text-amber-600 text-sm transition-colors">{loc.name}</span>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="py-24 px-4" style={{ background: "linear-gradient(180deg, #f8fafc 0%, #f0fdf4 100%)" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14">
            <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest">Club partners speak</span>
            <h2 className="text-4xl font-black text-slate-900 mt-2">Trusted by club managers across Ireland</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name}
                initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
                <Quote className="w-8 h-8 text-amber-400 mb-4 fill-amber-100" />
                <p className="text-slate-600 text-sm leading-relaxed flex-1 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-100">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-black text-sm shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-slate-400 text-xs">{t.title}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR CLUB MANAGERS ─────────────────────────────────────────────── */}
      <section className="py-24 px-4"
        style={{ background: "linear-gradient(135deg, #060d1a 0%, #0a1a0a 100%)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-amber-400 font-bold text-xs uppercase tracking-widest">For club managers & secretaries</span>
              <h2 className="text-4xl font-black text-white mt-3 mb-5 leading-tight">
                Fill your visitor slots without lifting the phone
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                TeeTime Ireland integrates directly with your existing schedule. You set the rules — which times are available to visitors, at what green fee, with what restrictions. We handle everything else.
              </p>
              <ul className="space-y-3 mb-8">
                {STANDARDS.map((s) => (
                  <li key={s} className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
              <a href="mailto:partnerships@teetime.ie"
                className="btn-gold inline-flex items-center gap-2 text-white font-bold px-6 py-3.5 rounded-2xl">
                <Phone className="w-4 h-4" /> Request a Partnership Call
              </a>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CLUB_FEATURES.map(({ icon: Icon, title, desc }, i) => (
                <motion.div key={title}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-4 shadow-lg shadow-amber-900/30">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-bold mb-1.5 text-sm">{title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-amber-500">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {STATS.map(({ value, label, sub }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="text-4xl font-black text-white mb-0.5">{value}</div>
              <div className="text-amber-900 font-bold text-sm">{label}</div>
              <div className="text-amber-800 text-xs mt-0.5">{sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS (GOLFER) ─────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest">For golfers</span>
            <h2 className="text-4xl font-black text-slate-900 mt-2">On the first tee in 3 steps</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            <div className="hidden sm:block absolute top-10 left-[20%] right-[20%] h-px bg-gradient-to-r from-emerald-200 via-amber-200 to-emerald-200" />
            {[
              { step: "01", icon: "📍", title: "Find your club", desc: "Enter your location or pick a county. Set your preferred date, group size and max price." },
              { step: "02", icon: "⛳", title: "Choose your tee time", desc: "Browse available slots across our partner clubs, shown on a live map with pricing and availability." },
              { step: "03", icon: "✅", title: "Book & play", desc: "Complete your booking in under 2 minutes. Receive your confirmation code instantly. Pay at the club." },
            ].map(({ step, icon, title, desc }, i) => (
              <motion.div key={step}
                initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="text-center relative">
                <div className="w-20 h-20 rounded-2xl bg-slate-900 flex flex-col items-center justify-center mx-auto mb-5 shadow-xl relative">
                  <span className="text-2xl">{icon}</span>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-black">{step}</div>
                </div>
                <h3 className="font-black text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-4"
        style={{ background: "linear-gradient(135deg, #060d1a 0%, #0a1f0a 100%)" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Logo size={52} showText={false} />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Your next round is<br />
            <span className="gradient-text">one click away</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto">
            Join thousands of golfers who have already discovered how easy booking a visitor tee time can be.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={`/search?lat=53.3498&lng=-6.2603&location=Ireland&date=${new Date().toISOString().split("T")[0]}&radius=200&players=2`}
              className="btn-gold inline-flex items-center justify-center gap-2 text-white font-black px-8 py-4 rounded-2xl text-base">
              Find a Tee Time <ChevronRight className="w-5 h-5" />
            </a>
            <a href="/register"
              className="inline-flex items-center justify-center gap-2 border border-white/15 text-white font-bold px-8 py-4 rounded-2xl text-base hover:bg-white/8 transition-colors">
              Create Free Account
            </a>
          </div>
          <div className="mt-10 flex items-center justify-center gap-6 flex-wrap">
            {["No booking fee", "Instant confirmation", "21+ clubs"].map((t) => (
              <div key={t} className="flex items-center gap-1.5 text-gray-500 text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> {t}
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
