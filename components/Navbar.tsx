"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { LogOut, LayoutDashboard, ChevronDown, Search, Flag } from "lucide-react";
import { useState, useEffect } from "react";
import { Logo } from "./Logo";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = session?.user as { name?: string; role?: string } | undefined;
  const isClubAdmin = user?.role === "club_admin" || user?.role === "super_admin";
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = isHome && !scrolled;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      transparent
        ? "bg-transparent border-b border-transparent"
        : "border-b border-white/6 shadow-2xl"
    }`}
      style={transparent ? {} : { background: "rgba(6,13,26,0.92)", backdropFilter: "blur(20px)" }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <Logo size={34} />
        </Link>

        <div className="flex items-center gap-2">
          <Link href={`/search?lat=53.3498&lng=-6.2603&location=Ireland&date=${new Date().toISOString().split("T")[0]}&radius=100&players=2`}
            className="hidden sm:flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-white/6">
            <Search className="w-3.5 h-3.5" /> Find Tee Times
          </Link>

          {session ? (
            <div className="relative">
              <button onClick={() => setOpen(!open)}
                className="flex items-center gap-2 border border-white/12 bg-white/6 hover:bg-white/10 rounded-full pl-2 pr-3 py-1.5 text-sm text-white transition-colors">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xs font-black text-white shadow">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <span className="hidden sm:block font-semibold text-sm">{user?.name?.split(" ")[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-50" />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 text-slate-800 overflow-hidden"
                  onMouseLeave={() => setOpen(false)}>
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 mb-1">
                    <div className="font-black text-sm text-slate-900">{user?.name}</div>
                    <div className="text-xs text-slate-400 truncate">{session.user?.email}</div>
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
                      <Flag className="w-4 h-4 text-amber-500" /> Club Dashboard
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
                className="text-sm text-gray-400 hover:text-white px-3 py-2 rounded-xl hover:bg-white/6 transition-colors hidden sm:block">
                Sign In
              </Link>
              <Link href="/register"
                className="btn-gold text-white text-sm px-4 py-2.5 rounded-xl font-black">
                Join Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
