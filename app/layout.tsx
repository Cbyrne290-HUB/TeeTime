import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "TeeTime Ireland – Book Golf Tee Times",
  description: "Find and book visitor tee times at golf clubs across Ireland. Filter by location, date and price.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900 antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="bg-green-900 text-green-100 py-8 mt-16">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <p className="font-semibold text-white text-lg mb-1">TeeTime Ireland</p>
              <p className="text-sm text-green-300">Connecting golfers with clubs across Ireland</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
