"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Flag, User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const user = session?.user as { name?: string; role?: string } | undefined;
  const isClubAdmin = user?.role === "club_admin" || user?.role === "super_admin";

  return (
    <nav className="bg-green-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:text-green-200 transition-colors">
          <Flag className="w-6 h-6 text-green-300" />
          TeeTime Ireland
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/search" className="text-sm text-green-200 hover:text-white transition-colors">
            Find Tee Times
          </Link>

          {session ? (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 bg-green-800 hover:bg-green-700 rounded-full px-3 py-1.5 text-sm transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:block">{user?.name?.split(" ")[0]}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {open && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 text-gray-800"
                  onMouseLeave={() => setOpen(false)}
                >
                  <Link
                    href="/my-bookings"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4 text-green-700" />
                    My Bookings
                  </Link>
                  {isClubAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <Flag className="w-4 h-4 text-green-700" />
                      Club Dashboard
                    </Link>
                  )}
                  <hr className="my-1" />
                  <button
                    onClick={() => { signOut({ callbackUrl: "/" }); setOpen(false); }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm text-green-200 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-green-500 hover:bg-green-400 text-white text-sm px-3 py-1.5 rounded-full font-medium transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
