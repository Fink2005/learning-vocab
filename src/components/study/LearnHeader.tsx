import { Button } from "@/components/ui/button";
import { ChevronLeft, Shuffle } from "lucide-react";
import { motion } from "framer-motion";

interface LearnHeaderProps {
  title: string;
  currentIndex: number;
  total: number;
  onBack: () => void;
  onShuffle: () => void;
  shuffleLabel?: string;
}

export function LearnHeader({
  title,
  currentIndex,
  total,
  onBack,
  onShuffle,
  shuffleLabel = "Shuffle",
}: LearnHeaderProps) {
  const progress = ((currentIndex + 1) / total) * 100;

  return (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-white/50 dark:border-gray-800 shrink-0 z-10">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack} 
          className="hover:bg-white/50 dark:hover:bg-gray-800/50"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex flex-col items-center">
          <h1 className="font-semibold text-sm text-gray-800 dark:text-gray-200">{title}</h1>
          <span className="text-xs text-muted-foreground">{currentIndex + 1} of {total}</span>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onShuffle} 
          title={shuffleLabel} 
          className="hover:bg-white/50 dark:hover:bg-gray-800/50"
        >
          <Shuffle className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1 w-full bg-gray-200/50 dark:bg-gray-800">
        <motion.div 
          className="h-full bg-linear-to-r from-brand-500 to-indigo-500" 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
