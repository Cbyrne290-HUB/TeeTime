import { Suspense } from "react";
import { ClubProfile } from "./ClubProfile";

export default function ClubPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading club…</div>}>
      <ClubProfile />
    </Suspense>
  );
}
