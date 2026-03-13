// Shared constants for the Interview module

export const TOTAL_ANSWER_TIME = 120;

export const TYPE_COLORS = {
  debugging:       "bg-orange-50 text-orange-500 border-orange-100",
  scenario:        "bg-purple-50 text-purple-500 border-purple-100",
  "system-design": "bg-blue-50 text-blue-500 border-blue-100",
  behavioral:      "bg-pink-50 text-pink-500 border-pink-100",
  project:         "bg-indigo-50 text-indigo-500 border-indigo-100",
  conceptual:      "bg-teal-50 text-teal-500 border-teal-100",
};

export const DIFF_COLORS = {
  hard:   "bg-red-50 text-red-500 border-red-100",
  medium: "bg-amber-50 text-amber-500 border-amber-100",
  easy:   "bg-emerald-50 text-emerald-600 border-emerald-100",
};

// ── Score helpers ──────────────────────────────────────────────────────────────
export const scoreColor    = (v) => v >= 70 ? "text-emerald-600" : v >= 40 ? "text-amber-500" : "text-red-500";
export const scoreBarColor = (v) => v >= 70 ? "bg-emerald-500"  : v >= 40 ? "bg-amber-400"  : "bg-red-400";
