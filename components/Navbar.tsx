"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Flag, User, LogOut, LayoutDashboard, ChevronDown, Search } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = session?.user as { name?: string; role?: string } | undefined;
  const isClubAdmin = user?.role === "club_admin" || user?.role === "super_admin";
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = isHome && !scrolled;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      transparent
        ? "bg-transparent border-b border-transparent"
        : "bg-slate-900/95 backdrop-blur-xl border-b border-white/8 shadow-xl"
    }`}>
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
            <Flag className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-white text-lg tracking-tight">TeeTime <span className="text-emerald-400">Ireland</span></span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/search?lat=53.3498&lng=-6.2603&location=Ireland&date=2026-04-27&radius=50&players=2"
            className="hidden sm:flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/8">
            <Search className="w-3.5 h-3.5" />
            Find Tee Times
          </Link>

          {session ? (
            <div className="relative">
              <button onClick={() => setOpen(!open)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/12 rounded-full pl-2 pr-3 py-1.5 text-sm text-white transition-colors">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-xs font-bold">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <span className="hidden sm:block font-medium">{user?.name?.split(" ")[0]}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 text-slate-800"
                  onMouseLeave={() => setOpen(false)}>
                  <div className="px-4 py-2 border-b border-slate-100 mb-1">
                    <div className="font-semibold text-sm">{user?.name}</div>
                    <div className="text-xs text-slate-400">{session.user?.email}</div>
                  </div>
                  <Link href="/my-bookings"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors"
                    onClick={() => setOpen(false)}>
                    <LayoutDashboard className="w-4 h-4 text-emerald-600" /> My Bookings
                  </Link>
                  {isClubAdmin && (
                    <Link href="/admin"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors"
                      onClick={() => setOpen(false)}>
                      <Flag className="w-4 h-4 text-emerald-600" /> Club Dashboard
                    </Link>
                  )}
                  <hr className="my-1 border-slate-100" />
                  <button onClick={() => { signOut({ callbackUrl: "/" }); setOpen(false); }}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full transition-colors">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login"
                className="text-sm text-gray-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/8 transition-colors hidden sm:block">
                Sign In
              </Link>
              <Link href="/register"
                className="btn-gold text-white text-sm px-4 py-2 rounded-xl font-bold">
                Sign Up Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
