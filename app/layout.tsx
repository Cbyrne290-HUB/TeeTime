import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "TeeTime Ireland – Book Visitor Tee Times at Ireland's Finest Golf Clubs",
  description: "Book visitor tee times instantly at 21+ partner golf clubs across Ireland. No membership required. Filter by location, date, price and group size.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased" style={{ background: "#f8fafc" }}>
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>

          <footer style={{ background: "#060d1a" }}>
            <div className="divider-gold" />
            <div className="max-w-6xl mx-auto px-6 py-16">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                {/* Brand */}
                <div className="md:col-span-2">
                  <Logo size={40} />
                  <p className="text-gray-500 text-sm mt-4 max-w-xs leading-relaxed">
                    Ireland&apos;s premier platform for visitor tee time bookings. Connecting golfers with the country&apos;s finest clubs since 2025.
                  </p>
                  <div className="flex items-center gap-3 mt-5">
                    <div className="w-8 h-8 rounded-lg bg-white/6 border border-white/8 flex items-center justify-center text-gray-400 hover:text-amber-400 hover:bg-white/10 transition-colors cursor-pointer">𝕏</div>
                    <div className="w-8 h-8 rounded-lg bg-white/6 border border-white/8 flex items-center justify-center text-gray-400 hover:text-amber-400 hover:bg-white/10 transition-colors cursor-pointer">in</div>
                    <div className="w-8 h-8 rounded-lg bg-white/6 border border-white/8 flex items-center justify-center text-gray-400 hover:text-amber-400 hover:bg-white/10 transition-colors cursor-pointer">f</div>
                  </div>
                </div>

                {/* Links */}
                <div>
                  <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-widest">Golfers</h4>
                  <ul className="space-y-2.5">
                    {["Find Tee Times", "How It Works", "Sign Up Free", "My Bookings"].map(l => (
                      <li key={l}><a href="#" className="text-gray-500 hover:text-amber-400 text-sm transition-colors">{l}</a></li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-widest">Clubs</h4>
                  <ul className="space-y-2.5">
                    {["Partner With Us", "Club Dashboard", "Pricing", "Contact"].map(l => (
                      <li key={l}><a href="#" className="text-gray-500 hover:text-amber-400 text-sm transition-colors">{l}</a></li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-white/6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-gray-600 text-xs">© 2025 TeeTime Ireland. All rights reserved.</p>
                <div className="flex items-center gap-4">
                  {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(l => (
                    <a key={l} href="#" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">{l}</a>
                  ))}
                </div>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
