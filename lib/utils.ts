import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fmt(n: number): string {
  return `€${n.toFixed(2)}`;
}

export function fmtDate(d: string | Date): string {
  return new Date(d).toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric" });
}

export const CATEGORIES = [
  { value: "MENS_CLOTHING", label: "Men's Clothing" },
  { value: "PERFUME", label: "Perfume / Fragrance" },
  { value: "ELECTRONICS", label: "Electronics" },
  { value: "SHOES", label: "Shoes" },
  { value: "ACCESSORIES", label: "Accessories" },
  { value: "OTHER", label: "Other" },
] as const;

export const CONDITIONS = [
  { value: "NEW_WITH_TAGS", label: "New with tags" },
  { value: "LIKE_NEW", label: "Like new" },
  { value: "GOOD", label: "Good" },
  { value: "FAIR", label: "Fair" },
  { value: "POOR", label: "Poor" },
] as const;

export const STATUS_LABELS: Record<string, string> = {
  BOUGHT: "In Stock",
  LISTED: "Listed",
  SOLD: "Sold",
  ARCHIVED: "Archived",
};

export const STATUS_COLORS: Record<string, string> = {
  BOUGHT: "#f59e0b",
  LISTED: "#3b82f6",
  SOLD: "#22c55e",
  ARCHIVED: "#6b7280",
};

export function categoryLabel(v: string) {
  return CATEGORIES.find((c) => c.value === v)?.label ?? v;
}
