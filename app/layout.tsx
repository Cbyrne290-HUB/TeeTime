import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "VintedFlip – Reselling Tracker",
  description: "Track your Vinted buys, listings, and profits. Find the best deals to flip.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased" style={{ background: "var(--background)", color: "var(--text)" }}>
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="py-6 mt-12 border-t" style={{ borderColor: "var(--border)" }}>
            <div className="max-w-6xl mx-auto px-4 text-center text-sm" style={{ color: "var(--text-muted)" }}>
              VintedFlip &mdash; your personal reselling tracker
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
