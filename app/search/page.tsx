import { Suspense } from "react";
import { SearchResults } from "./SearchResults";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Searching…</div>}>
      <SearchResults />
    </Suspense>
  );
}
