"use client";
import { SearchForm } from "@/components/SearchForm";
import { motion } from "framer-motion";
import { MapPin, Clock, CreditCard, Star, ChevronRight } from "lucide-react";

const FLOATING_CARDS = [
  { club: "The K Club", time: "09:30", price: "€150", county: "Kildare", spots: 2, delay: 0, cls: "float-a" },
  { club: "Ballybunion", time: "11:00", price: "€90", county: "Kerry", spots: 4, delay: 0.3, cls: "float-b" },
  { club: "Old Head Links", time: "14:20", price: "€250", county: "Cork", spots: 2, delay: 0.6, cls: "float-c" },
];

const HOW_IT_WORKS = [
  { icon: MapPin, title: "Find nearby clubs", desc: "Set your location and radius — we show every club with visitor tee times available on your date.", color: "from-emerald-400 to-teal-500" },
  { icon: Clock, title: "Pick your slot", desc: "Browse available times, filter by price, and grab the slot that fits your group.", color: "from-amber-400 to-orange-500" },
  { icon: CreditCard, title: "Book & play", desc: "Fill in your details in under a minute, get a confirmation code, and pay at the club.", color: "from-violet-400 to-purple-500" },
];

const FEATURED_CLUBS = [
  { name: "The K Club", county: "Kildare", price: "€150", rating: 4.9, holes: 18, tag: "Ryder Cup venue" },
  { name: "Lahinch Golf Club", county: "Clare", price: "€100", rating: 4.8, holes: 18, tag: "World-class links" },
  { name: "Old Head Golf Links", county: "Cork", price: "€250", rating: 5.0, holes: 18, tag: "Clifftop spectacular" },
  { name: "Adare Manor", county: "Limerick", price: "€200", rating: 4.9, holes: 18, tag: "2027 Ryder Cup" },
];

export default function Home() {
  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1f0d 40%, #0a1628 100%)" }}>

        {/* Animated gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="orb-a absolute w-[600px] h-[600px] rounded-full left-[-10%] top-[-10%]"
            style={{ background: "radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)" }} />
          <div className="orb-b absolute w-[500px] h-[500px] rounded-full right-[-5%] bottom-[-5%]"
            style={{ background: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)" }} />
          <div className="absolute w-[400px] h-[400px] rounded-full left-[40%] top-[-20%]"
            style={{ background: "radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)" }} />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Floating tee time preview cards */}
        {FLOATING_CARDS.map((c) => (
          <div key={c.club}
            className={`absolute hidden xl:block glass rounded-2xl px-4 py-3 ${c.cls}`}
            style={c.club === "The K Club"
              ? { left: "4%", top: "22%" }
              : c.club === "Ballybunion"
                ? { right: "4%", top: "18%" }
                : { right: "6%", bottom: "22%" }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 badge-pulse" />
              <span className="text-white font-semibold text-sm">{c.club}</span>
            </div>
            <div className="text-gray-400 text-xs mb-2">{c.county}</div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-emerald-300 font-bold text-lg">{c.time}</span>
              <span className="text-amber-400 font-bold">{c.price}</span>
            </div>
            <div className="text-gray-500 text-xs mt-1">{c.spots} spots left</div>
          </div>
        ))}

        {/* Main content */}
        <div className="relative z-10 max-w-3xl mx-auto px-4 py-20 text-center w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 bg-white/8 border border-white/12 rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 rounded-full bg-emerald-400 badge-pulse" />
              <span className="text-emerald-300 text-sm font-medium">Live tee times across Ireland</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-4 leading-[1.05] tracking-tight">
              Book a tee time<br />
              <span className="gradient-text">anywhere in Ireland</span>
            </h1>
            <p className="text-gray-400 text-lg sm:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
              No membership. No phone calls. Just find an available slot, book in minutes, and play.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="glass rounded-3xl p-6 sm:p-8 shadow-2xl">
            <SearchForm />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500">
            {[["50+", "Golf clubs"], ["32", "Counties"], ["Free", "No booking fee"]].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-white font-bold text-xl">{val}</div>
                <div>{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-16">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-widest">Simple process</span>
            <h2 className="text-4xl font-black text-slate-900 mt-2">Tee off in 3 steps</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center group">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-black text-slate-200 mb-2">0{i + 1}</div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured clubs ── */}
      <section className="py-24 px-4"
        style={{ background: "linear-gradient(180deg, #f8fafc 0%, #ecfdf5 100%)" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="text-amber-500 font-semibold text-sm uppercase tracking-widest">Top rated</span>
              <h2 className="text-4xl font-black text-slate-900 mt-1">Featured courses</h2>
            </div>
            <a href="/search?lat=53.3498&lng=-6.2603&location=Ireland&date=2026-04-27&radius=200&players=2"
              className="flex items-center gap-1 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
              View all <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURED_CLUBS.map((club, i) => (
              <motion.div key={club.name}
                initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <FeaturedClubCard club={club} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-4"
        style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #064e3b 100%)" }}>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to play?</h2>
          <p className="text-emerald-200 mb-8 text-lg">Find your perfect tee time right now — no membership required.</p>
          <a href="/search?lat=53.3498&lng=-6.2603&location=Ireland&date=2026-04-27&radius=100&players=2"
            className="btn-gold inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-2xl text-lg">
            Find Tee Times <ChevronRight className="w-5 h-5" />
          </a>
        </motion.div>
      </section>
    </div>
  );
}

function FeaturedClubCard({ club }: { club: typeof FEATURED_CLUBS[0] }) {
  return (
    <a href={`/clubs/${club.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
      className="tilt-card block bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-shadow duration-300 group">
      {/* Gradient image placeholder */}
      <div className="h-28 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #065f46 0%, #0a0f1e 100%)" }}>
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="w-20 h-20 border-4 border-white rounded-full" />
        </div>
        <div className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full">
          {club.tag}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-emerald-700 transition-colors">{club.name}</h3>
        <div className="text-slate-400 text-xs mt-0.5 mb-3">{club.county} · {club.holes} holes</div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">from</div>
            <div className="text-emerald-600 font-black text-lg">{club.price}</div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-sm font-semibold text-slate-700">{club.rating}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
