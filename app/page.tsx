"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { SearchForm } from "@/components/SearchForm";
import { Logo } from "@/components/Logo";
import { CheckCircle, Clock, Users, BarChart3, Shield, Zap, ChevronRight, Star } from "lucide-react";

const HeroScene = dynamic(() => import("@/components/HeroScene").then(m => m.HeroScene), { ssr: false });

const PARTNER_CLUBS = [
  "The K Club", "Portmarnock", "Royal Dublin", "Lahinch",
  "Ballybunion", "Old Head Links", "Adare Manor", "Mount Juliet",
  "Druids Glen", "Powerscourt", "Royal Portrush", "Doonbeg",
];

const STEPS = [
  { n: "01", title: "Choose your club", desc: "Browse 21+ partner clubs across every county. Filter by date, price, location and group size." },
  { n: "02", title: "Pick your time", desc: "See real available slots in real time. Select your preferred tee time in seconds." },
  { n: "03", title: "Confirm instantly", desc: "Enter your details, confirm the booking. Pay at the club on the day — no card required." },
];

const STATS = [
  { value: "21+", label: "Partner Clubs" },
  { value: "€0",  label: "Setup Cost" },
  { value: "2 min", label: "Avg. booking time" },
  { value: "34%", label: "Avg. revenue uplift" },
];

const FEATURES = [
  { icon: Zap,       title: "Zero daily admin",      desc: "Set your schedule once. Slots generate automatically for 30 days ahead." },
  { icon: Shield,    title: "Full club control",      desc: "You decide which times are open to visitors, at what price." },
  { icon: BarChart3, title: "Real-time reporting",    desc: "Live bookings, revenue and occupancy data on your dashboard." },
  { icon: Users,     title: "Verified visitors only", desc: "Every golfer provides verified contact details at booking." },
];

const STANDARDS = [
  "Exclusive to registered Irish golf clubs",
  "Visitor vetting at point of booking",
  "Club branding preserved throughout",
  "Dedicated club relationship manager",
  "GDPR-compliant data handling",
  "No last-minute cancellation abuse",
];

const LOCATIONS = [
  { label: "Dublin",   lat: 53.3498, lng: -6.2603 },
  { label: "Cork",     lat: 51.8985, lng: -8.4756 },
  { label: "Kerry",    lat: 52.1545, lng: -9.5669 },
  { label: "Galway",   lat: 53.2707, lng: -9.0568 },
  { label: "Limerick", lat: 52.6638, lng: -8.6267 },
  { label: "Clare",    lat: 52.9336, lng: -9.3443 },
];

const today = new Date().toISOString().split("T")[0];

export default function Home() {
  return (
    <div className="overflow-x-hidden bg-white">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col lg:flex-row">

        {/* Left — text + search */}
        <div className="relative z-10 flex flex-col justify-center px-8 lg:px-16 py-20 lg:py-0 lg:w-1/2 xl:w-[52%]">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600 badge-pulse inline-block" />
              Ireland&apos;s Premier Booking Platform
            </div>

            <h1 className="text-5xl xl:text-6xl font-black text-gray-900 leading-[1.05] tracking-tight mb-6">
              Book Ireland&apos;s<br />
              <span className="text-green-700">Finest</span> Tee Times<br />
              Instantly
            </h1>

            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
              No membership required. Browse 21+ partner clubs, pick your time, and confirm in under two minutes.
            </p>

            {/* Search card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
              <SearchForm />
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 mt-6">
              <div className="flex -space-x-2">
                {["JM","SO","PW","CD"].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-green-700 border-2 border-white flex items-center justify-center text-white text-xs font-black">{i[0]}</div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Trusted by 2,400+ golfers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — canvas animation */}
        <div className="relative lg:w-1/2 xl:w-[48%] h-64 lg:h-auto overflow-hidden">
          <HeroScene />
          {/* Overlay text on canvas */}
          <div className="absolute bottom-8 left-8 right-8 pointer-events-none">
            <p className="text-white/60 text-xs font-medium uppercase tracking-widest">Live on the fairway</p>
          </div>
        </div>
      </section>

      {/* ── PARTNER CLUBS ────────────────────────────────────────────────── */}
      <section className="border-y border-gray-100 py-6 bg-gray-50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-5">Official booking partner of</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {PARTNER_CLUBS.map((club) => (
              <span key={club} className="text-sm text-gray-500 font-medium whitespace-nowrap">{club}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-3">Simple process</p>
            <h2 className="text-4xl font-black text-gray-900">Book in three steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div key={s.n} className="relative">
                <div className="text-7xl font-black text-gray-100 leading-none mb-4 select-none">{s.n}</div>
                <h3 className="font-black text-xl text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href={`/search?lat=53.3498&lng=-6.2603&location=Ireland&date=${today}&radius=200&players=2`}
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold">
              Find Available Tee Times <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── BROWSE BY COUNTY ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-3">Browse by region</p>
            <h2 className="text-3xl font-black text-gray-900">Where are you playing?</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {LOCATIONS.map((loc) => (
              <Link
                key={loc.label}
                href={`/search?lat=${loc.lat}&lng=${loc.lng}&location=${loc.label}&date=${today}&radius=80&players=2`}
                className="group flex items-center justify-between bg-white border border-gray-200 hover:border-green-600 hover:bg-green-50 rounded-xl px-5 py-4 transition-all duration-200">
                <span className="font-bold text-gray-800 group-hover:text-green-800">{loc.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-700 transition-colors" />
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href={`/search?lat=53.1424&lng=-7.6921&location=Ireland&date=${today}&radius=300&players=2`}
              className="text-green-700 font-bold text-sm hover:text-green-600 underline underline-offset-4">
              View all clubs across Ireland
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="bg-green-800 py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-black text-white mb-1">{s.value}</div>
              <div className="text-green-300 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOR CLUB MANAGERS ────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-4">For club managers</p>
              <h2 className="text-4xl font-black text-white leading-tight mb-6">
                Fill your visitor slots.<br />
                Keep full control.
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                Set your schedule once and let TeeTime Ireland handle the rest. We bring qualified visitors to your club without disrupting member priority or your pro shop workflow.
              </p>
              <div className="space-y-3 mb-8">
                {STANDARDS.map((s) => (
                  <div key={s} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{s}</span>
                  </div>
                ))}
              </div>
              <Link href="/register"
                className="btn-white inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold">
                Partner With Us <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-900 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm mb-1">{title}</div>
                    <div className="text-gray-400 text-xs leading-relaxed">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 text-center bg-white border-t border-gray-100">
        <div className="max-w-xl mx-auto">
          <Logo size={48} dark showText={false} />
          <h2 className="text-4xl font-black text-gray-900 mt-6 mb-4">Ready to tee off?</h2>
          <p className="text-gray-500 mb-8">Browse available times at Ireland&apos;s finest clubs and book in under two minutes.</p>
          <Link href={`/search?lat=53.3498&lng=-6.2603&location=Ireland&date=${today}&radius=200&players=2`}
            className="btn-primary inline-flex items-center gap-2 px-10 py-4 rounded-xl text-lg font-black">
            Find Tee Times <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
