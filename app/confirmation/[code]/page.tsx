import { Suspense } from "react";
import { ConfirmationView } from "./ConfirmationView";

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading…</div>}>
      <ConfirmationView />
    </Suspense>
  );
}
