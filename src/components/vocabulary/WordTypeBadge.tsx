import type { WordType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { wordTypeLabels, wordTypeColors } from "@/lib/wordTypes";

interface WordTypeBadgeProps {
  wordType: WordType | null | undefined;
  className?: string;
}

export function WordTypeBadge({ wordType, className = "" }: WordTypeBadgeProps) {
  if (!wordType) return null;

  return (
    <Badge 
      variant="outline" 
      className={`${wordTypeColors[wordType]} border ${className}`}
    >
      {wordTypeLabels[wordType]}
    </Badge>
  );
}
