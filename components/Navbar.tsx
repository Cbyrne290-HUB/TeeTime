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
  const isHero = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On hero: transparent white until scroll, then solid white
  const transparent = isHero && !scrolled;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      transparent
        ? "bg-transparent border-b border-transparent"
        : "bg-white border-b border-gray-100 shadow-sm"
    }`}>
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
        <Link href="/">
          <Logo size={34} dark={!transparent} showText />
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href={`/search?lat=53.3498&lng=-6.2603&location=Ireland&date=${new Date().toISOString().split("T")[0]}&radius=200&players=2`}
            className={`hidden sm:flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
              transparent ? "text-white/80 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}>
            <Search className="w-3.5 h-3.5" /> Find Tee Times
          </Link>

          {session ? (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className={`flex items-center gap-2 rounded-full pl-2 pr-3 py-1.5 text-sm font-semibold transition-colors ${
                  transparent
                    ? "border border-white/20 text-white hover:bg-white/10"
                    : "border border-gray-200 text-gray-800 hover:bg-gray-50"
                }`}>
                <div className="w-7 h-7 rounded-full bg-green-700 flex items-center justify-center text-xs font-black text-white">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <span className="hidden sm:block">{user?.name?.split(" ")[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-50" />
              </button>

              {open && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden"
                  onMouseLeave={() => setOpen(false)}>
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 mb-1">
                    <div className="font-black text-sm text-gray-900">{user?.name}</div>
                    <div className="text-xs text-gray-400 truncate">{session.user?.email}</div>
                  </div>
                  <Link href="/my-bookings"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setOpen(false)}>
                    <LayoutDashboard className="w-4 h-4 text-green-700" /> My Bookings
                  </Link>
                  {isClubAdmin && (
                    <Link href="/admin"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setOpen(false)}>
                      <Flag className="w-4 h-4 text-red-600" /> Club Dashboard
                    </Link>
                  )}
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={() => { signOut({ callbackUrl: "/" }); setOpen(false); }}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors hidden sm:block ${
                  transparent ? "text-white/80 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}>
                Sign In
              </Link>
              <Link
                href="/register"
                className="btn-primary text-white text-sm px-4 py-2 rounded-lg font-bold">
                Join Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
