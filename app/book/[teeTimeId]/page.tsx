import { Suspense } from "react";
import { BookingForm } from "./BookingForm";

export default function BookPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading…</div>}>
      <BookingForm />
    </Suspense>
  );
}
