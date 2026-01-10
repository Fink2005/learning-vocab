import type { VocabularyLevel } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { levelColors, levelProgressColors } from "@/lib/levels";

interface LevelBadgeProps {
  level: VocabularyLevel;
  className?: string;
}

// Level labels - can extend for JLPT/HSK
const levelLabels: Record<VocabularyLevel, string> = {
  // CEFR
  A1: "A1 - Beginner",
  A2: "A2 - Elementary",
  B1: "B1 - Intermediate",
  B2: "B2 - Upper Int.",
  C1: "C1 - Advanced",
  C2: "C2 - Proficient",
  // JLPT
  N5: "N5 - Beginner",
  N4: "N4 - Elementary",
  N3: "N3 - Intermediate",
  N2: "N2 - Upper Int.",
  N1: "N1 - Advanced",
  // HSK
  HSK1: "HSK1 - Beginner",
  HSK2: "HSK2 - Elementary",
  HSK3: "HSK3 - Intermediate",
  HSK4: "HSK4 - Upper Int.",
  HSK5: "HSK5 - Advanced",
  HSK6: "HSK6 - Proficient",
};

export function LevelBadge({ level, className }: LevelBadgeProps) {
  return (
    <Badge variant="outline" className={cn(levelColors[level], "font-medium", className)}>
      {levelLabels[level]}
    </Badge>
  );
}

export function LevelDot({ level }: { level: VocabularyLevel }) {
  return (
    <span
      className={cn("inline-block w-2 h-2 rounded-full", levelProgressColors[level])}
      title={level}
    />
  );
}
