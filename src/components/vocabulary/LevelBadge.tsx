import type { VocabularyLevel } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  level: VocabularyLevel;
  className?: string;
}

const levelConfig: Record<
  VocabularyLevel,
  { label: string; className: string }
> = {
  A1: {
    label: "A1 - Beginner",
    className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300",
  },
  A2: {
    label: "A2 - Elementary",
    className: "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300",
  },
  B1: {
    label: "B1 - Intermediate",
    className: "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-300",
  },
  B2: {
    label: "B2 - Upper Int.",
    className: "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-300",
  },
  C1: {
    label: "C1 - Advanced",
    className: "bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900 dark:text-rose-300",
  },
  C2: {
    label: "C2 - Proficient",
    className: "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300",
  },
};

export function LevelBadge({ level, className }: LevelBadgeProps) {
  const config = levelConfig[level];

  return (
    <Badge variant="outline" className={cn(config.className, "font-medium", className)}>
      {config.label}
    </Badge>
  );
}

export function LevelDot({ level }: { level: VocabularyLevel }) {
  const dotColors: Record<VocabularyLevel, string> = {
    A1: "bg-emerald-500",
    A2: "bg-green-500",
    B1: "bg-amber-500",
    B2: "bg-orange-500",
    C1: "bg-rose-500",
    C2: "bg-purple-500",
  };

  return (
    <span
      className={cn("inline-block w-2 h-2 rounded-full", dotColors[level])}
      title={level}
    />
  );
}
