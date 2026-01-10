import type { VocabularyLevel } from "@/types";

// Level colors for all level systems
export const levelColors: Record<VocabularyLevel, string> = {
  // CEFR (English, German)
  A1: "bg-emerald-100 text-emerald-700 border-emerald-200",
  A2: "bg-green-100 text-green-700 border-green-200",
  B1: "bg-amber-100 text-amber-700 border-amber-200",
  B2: "bg-orange-100 text-orange-700 border-orange-200",
  C1: "bg-rose-100 text-rose-700 border-rose-200",
  C2: "bg-purple-100 text-purple-700 border-purple-200",
  // JLPT (Japanese)
  N5: "bg-emerald-100 text-emerald-700 border-emerald-200",
  N4: "bg-green-100 text-green-700 border-green-200",
  N3: "bg-amber-100 text-amber-700 border-amber-200",
  N2: "bg-orange-100 text-orange-700 border-orange-200",
  N1: "bg-rose-100 text-rose-700 border-rose-200",
  // HSK (Chinese)
  HSK1: "bg-emerald-100 text-emerald-700 border-emerald-200",
  HSK2: "bg-green-100 text-green-700 border-green-200",
  HSK3: "bg-amber-100 text-amber-700 border-amber-200",
  HSK4: "bg-orange-100 text-orange-700 border-orange-200",
  HSK5: "bg-rose-100 text-rose-700 border-rose-200",
  HSK6: "bg-purple-100 text-purple-700 border-purple-200",
};

// Gradient backgrounds for mobile cards
export const levelGradients: Record<VocabularyLevel, string> = {
  // CEFR
  A1: "from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40",
  A2: "from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40",
  B1: "from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/40",
  B2: "from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/40",
  C1: "from-rose-50 to-pink-50 dark:from-rose-950/40 dark:to-pink-950/40",
  C2: "from-purple-50 to-violet-50 dark:from-purple-950/40 dark:to-violet-950/40",
  // JLPT
  N5: "from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40",
  N4: "from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40",
  N3: "from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/40",
  N2: "from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/40",
  N1: "from-rose-50 to-pink-50 dark:from-rose-950/40 dark:to-pink-950/40",
  // HSK
  HSK1: "from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40",
  HSK2: "from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40",
  HSK3: "from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/40",
  HSK4: "from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/40",
  HSK5: "from-rose-50 to-pink-50 dark:from-rose-950/40 dark:to-pink-950/40",
  HSK6: "from-purple-50 to-violet-50 dark:from-purple-950/40 dark:to-violet-950/40",
};

// Border colors for mobile cards
export const levelBorderColors: Record<VocabularyLevel, string> = {
  // CEFR
  A1: "border-l-emerald-400",
  A2: "border-l-green-400",
  B1: "border-l-amber-400",
  B2: "border-l-orange-400",
  C1: "border-l-rose-400",
  C2: "border-l-purple-400",
  // JLPT
  N5: "border-l-emerald-400",
  N4: "border-l-green-400",
  N3: "border-l-amber-400",
  N2: "border-l-orange-400",
  N1: "border-l-rose-400",
  // HSK
  HSK1: "border-l-emerald-400",
  HSK2: "border-l-green-400",
  HSK3: "border-l-amber-400",
  HSK4: "border-l-orange-400",
  HSK5: "border-l-rose-400",
  HSK6: "border-l-purple-400",
};

// Profile page progress bar colors
export const levelProgressColors: Record<VocabularyLevel, string> = {
  // CEFR
  A1: "bg-emerald-500",
  A2: "bg-green-500",
  B1: "bg-amber-500",
  B2: "bg-orange-500",
  C1: "bg-rose-500",
  C2: "bg-purple-500",
  // JLPT
  N5: "bg-emerald-500",
  N4: "bg-green-500",
  N3: "bg-amber-500",
  N2: "bg-orange-500",
  N1: "bg-rose-500",
  // HSK
  HSK1: "bg-emerald-500",
  HSK2: "bg-green-500",
  HSK3: "bg-amber-500",
  HSK4: "bg-orange-500",
  HSK5: "bg-rose-500",
  HSK6: "bg-purple-500",
};

// Badge gradient colors
export const levelBadgeGradients: Record<VocabularyLevel, string> = {
  // CEFR
  A1: "from-emerald-500 to-emerald-600",
  A2: "from-green-500 to-green-600",
  B1: "from-amber-500 to-amber-600",
  B2: "from-orange-500 to-orange-600",
  C1: "from-rose-500 to-rose-600",
  C2: "from-purple-500 to-purple-600",
  // JLPT
  N5: "from-emerald-500 to-emerald-600",
  N4: "from-green-500 to-green-600",
  N3: "from-amber-500 to-amber-600",
  N2: "from-orange-500 to-orange-600",
  N1: "from-rose-500 to-rose-600",
  // HSK
  HSK1: "from-emerald-500 to-emerald-600",
  HSK2: "from-green-500 to-green-600",
  HSK3: "from-amber-500 to-amber-600",
  HSK4: "from-orange-500 to-orange-600",
  HSK5: "from-rose-500 to-rose-600",
  HSK6: "from-purple-500 to-purple-600",
};

// Chart colors
export const levelChartColors: Record<VocabularyLevel, string> = {
  // CEFR
  A1: "#10b981",
  A2: "#22c55e",
  B1: "#f59e0b",
  B2: "#f97316",
  C1: "#f43f5e",
  C2: "#a855f7",
  // JLPT
  N5: "#10b981",
  N4: "#22c55e",
  N3: "#f59e0b",
  N2: "#f97316",
  N1: "#f43f5e",
  // HSK
  HSK1: "#10b981",
  HSK2: "#22c55e",
  HSK3: "#f59e0b",
  HSK4: "#f97316",
  HSK5: "#f43f5e",
  HSK6: "#a855f7",
};

// Get levels for a specific system
export function getLevelsForSystem(systemCode: string): VocabularyLevel[] {
  switch (systemCode) {
    case "cefr":
      return ["A1", "A2", "B1", "B2", "C1", "C2"];
    case "jlpt":
      return ["N5", "N4", "N3", "N2", "N1"];
    case "hsk":
      return ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6"];
    default:
      return ["A1", "A2", "B1", "B2", "C1", "C2"];
  }
}

// Default levels (CEFR)
export const defaultLevels: VocabularyLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
