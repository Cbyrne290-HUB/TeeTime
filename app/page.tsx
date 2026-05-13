import { SearchForm } from "@/components/SearchForm";
import { Flag, MapPin, Clock, CreditCard } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-green-900 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #22c55e 0%, transparent 50%), radial-gradient(circle at 80% 20%, #86efac 0%, transparent 40%)" }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Flag className="w-8 h-8 text-green-300" />
            <span className="text-green-300 font-medium tracking-wide uppercase text-sm">TeeTime Ireland</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Book a Visitor Tee Time<br />
            <span className="text-green-300">Anywhere in Ireland</span>
          </h1>
          <p className="text-green-100 text-lg mb-10 max-w-xl mx-auto">
            Find available tee times at golf clubs near you, filter by price and location, and book in minutes — no membership needed.
          </p>
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-12">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { icon: MapPin, title: "Find nearby clubs", desc: "Search by your location and set a radius — we show you all clubs with available visitor tee times." },
            { icon: Clock, title: "Pick your time", desc: "Browse available slots, filter by price, and choose the time that suits you and your group." },
            { icon: CreditCard, title: "Book & play", desc: "Fill in your details, confirm your booking, and pay at the club. Simple as that." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon className="w-7 h-7 text-green-700" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-green-800 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { value: "50+", label: "Golf Clubs" },
            { value: "32", label: "Counties" },
            { value: "Free", label: "No booking fee" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl font-bold text-green-300 mb-1">{value}</div>
              <div className="text-green-200 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
