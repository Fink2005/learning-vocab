import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LearnControlsProps {
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  isLast: boolean;
  prevLabel?: string;
  nextLabel?: string;
  finishLabel?: string;
}

export function LearnControls({
  onPrev,
  onNext,
  hasPrev,
  isLast,
  prevLabel = "Prev",
  nextLabel = "Next",
  finishLabel = "Finish",
}: LearnControlsProps) {
  return (
    <div className="p-4 sm:p-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-t border-white/50 dark:border-gray-800 shrink-0">
      <div className="container mx-auto max-w-lg flex items-center justify-center gap-4">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={onPrev} 
          className="flex-1 h-12 bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
          disabled={!hasPrev}
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          {prevLabel}
        </Button>
        
        <Button 
          size="lg" 
          onClick={onNext}
          className="flex-2 h-12 bg-linear-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white shadow-lg shadow-brand-200/50 dark:shadow-none rounded-xl text-base font-semibold"
        >
          {isLast ? finishLabel : nextLabel}
          {!isLast && <ChevronRight className="h-5 w-5 ml-1" />}
        </Button>
      </div>
    </div>
  );
}
