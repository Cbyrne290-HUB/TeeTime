"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Flag, Plus, Calendar, Users, Clock, RefreshCw, CheckCircle } from "lucide-react";

type Schedule = { id: string; name: string; daysOfWeek: string; startTime: string; endTime: string; intervalMins: number; pricePerPlayer: number; maxPlayers: number; isActive: boolean };
type Booking = { id: string; confirmationCode: string; guestName: string; guestEmail: string; guestPhone: string; numberOfPlayers: number; needsTrolley: boolean; needsBuggy: boolean; totalPrice: number; teeTime: { dateTime: string } };

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as { role?: string; clubId?: string } | undefined;

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // New schedule form state
  const [form, setForm] = useState({
    name: "Visitor Rate",
    daysOfWeek: [1, 2, 3, 4, 5],
    startTime: "08:00",
    endTime: "17:00",
    intervalMins: 10,
    maxPlayers: 4,
    pricePerPlayer: 35,
    validFrom: new Date().toISOString().split("T")[0],
    validTo: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && user?.role !== "club_admin" && user?.role !== "super_admin") {
      router.push("/");
    }
  }, [status, user, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    Promise.all([
      fetch("/api/admin/schedules").then((r) => r.json()),
      fetch("/api/admin/bookings").then((r) => r.json()),
    ]).then(([s, b]) => {
      setSchedules(Array.isArray(s) ? s : []);
      setBookings(Array.isArray(b) ? b : []);
      setLoading(false);
    });
  }, [status]);

  async function generateSlots() {
    setGenerating(true);
    const res = await fetch("/api/admin/generate-slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ daysAhead: 30 }),
    });
    const d = await res.json();
    setGenerated(d.generated ?? 0);
    setGenerating(false);
  }

  async function saveSchedule(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, validTo: form.validTo || null }),
    });
    const s = await res.json();
    setSchedules((prev) => [s, ...prev]);
    setShowForm(false);
    setSaving(false);
  }

  function toggleDay(day: number) {
    setForm((f) => ({
      ...f,
      daysOfWeek: f.daysOfWeek.includes(day)
        ? f.daysOfWeek.filter((d) => d !== day)
        : [...f.daysOfWeek, day],
    }));
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard…</div>;

  const todayBookings = bookings.filter((b) => {
    const d = new Date(b.teeTime.dateTime);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Flag className="w-6 h-6 text-green-700" /> Club Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your tee time schedules and bookings</p>
        </div>
        <button onClick={generateSlots} disabled={generating}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-60">
          <RefreshCw className={`w-4 h-4 ${generating ? "animate-spin" : ""}`} />
          {generating ? "Generating…" : "Generate next 30 days"}
        </button>
      </div>

      {generated !== null && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6 flex items-center gap-2 text-sm text-green-700">
          <CheckCircle className="w-4 h-4" /> {generated} tee time slots generated successfully.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Today's Bookings", value: todayBookings.length, icon: Calendar },
          { label: "Total Bookings", value: bookings.length, icon: Users },
          { label: "Schedules Active", value: schedules.filter((s) => s.isActive).length, icon: Clock },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <Icon className="w-5 h-5 text-green-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Schedules */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">Tee Time Schedules</h2>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1 text-sm bg-green-700 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors">
            <Plus className="w-4 h-4" /> Add Schedule
          </button>
        </div>

        {showForm && (
          <form onSubmit={saveSchedule} className="p-5 border-b border-gray-100 bg-green-50 space-y-4">
            <h3 className="font-semibold text-gray-700">New Schedule</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Schedule Name</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" required />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Price per player (€)</label>
                <input type="number" value={form.pricePerPlayer} min={0}
                  onChange={(e) => setForm((f) => ({ ...f, pricePerPlayer: parseFloat(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" required />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                <input type="time" value={form.startTime} onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" required />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End Time</label>
                <input type="time" value={form.endTime} onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" required />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Interval (minutes)</label>
                <select value={form.intervalMins} onChange={(e) => setForm((f) => ({ ...f, intervalMins: parseInt(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                  {[7, 8, 10, 12, 15, 20].map((m) => <option key={m} value={m}>{m} min</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Max players per slot</label>
                <select value={form.maxPlayers} onChange={(e) => setForm((f) => ({ ...f, maxPlayers: parseInt(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                  {[2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Valid From</label>
                <input type="date" value={form.validFrom} onChange={(e) => setForm((f) => ({ ...f, validFrom: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" required />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Valid To (optional)</label>
                <input type="date" value={form.validTo} onChange={(e) => setForm((f) => ({ ...f, validTo: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">Days of Week</label>
              <div className="flex gap-2">
                {DAY_NAMES.map((d, i) => (
                  <button key={d} type="button" onClick={() => toggleDay(i)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${form.daysOfWeek.includes(i) ? "bg-green-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving}
                className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-60 transition-colors">
                {saving ? "Saving…" : "Save Schedule"}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="divide-y divide-gray-100">
          {schedules.length === 0 && (
            <div className="p-8 text-center text-gray-400 text-sm">No schedules yet. Add one above.</div>
          )}
          {schedules.map((s) => {
            const days: number[] = JSON.parse(s.daysOfWeek);
            return (
              <div key={s.id} className="p-5 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-800">{s.name}</div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    {s.startTime}–{s.endTime} · every {s.intervalMins} min · €{s.pricePerPlayer}/player
                  </div>
                  <div className="flex gap-1 mt-1.5">
                    {DAY_NAMES.map((d, i) => (
                      <span key={d} className={`text-xs px-1.5 py-0.5 rounded ${days.includes(i) ? "bg-green-100 text-green-700" : "text-gray-200"}`}>
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {s.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bookings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">Recent Bookings</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {bookings.length === 0 && (
            <div className="p-8 text-center text-gray-400 text-sm">No bookings yet.</div>
          )}
          {bookings.slice(0, 20).map((b) => {
            const time = new Date(b.teeTime.dateTime).toLocaleString("en-IE", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
            return (
              <div key={b.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-800">{b.guestName}</div>
                  <div className="text-sm text-gray-500">{b.guestEmail} · {b.guestPhone}</div>
                  <div className="flex gap-3 text-xs text-gray-400 mt-1">
                    <span>{time}</span>
                    <span>{b.numberOfPlayers} players</span>
                    {b.needsTrolley && <span>Trolley</span>}
                    {b.needsBuggy && <span>Buggy</span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-700">€{b.totalPrice.toFixed(2)}</div>
                  <div className="text-xs font-mono text-gray-400 mt-0.5">{b.confirmationCode}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
