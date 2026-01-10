import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { levelColors } from "@/lib/levels";
import type { VocabularyLevel } from "@/types";

interface FlashCardProps {
  word: string;
  meaning: string;
  ipa?: string | null;
  example?: string | null;
  level?: VocabularyLevel | null;
  isFlipped: boolean;
  onFlip: () => void;
  flipHint?: string;
}

export function FlashCard({
  word,
  meaning,
  ipa,
  example,
  level,
  isFlipped,
  onFlip,
  flipHint = "Tap to flip",
}: FlashCardProps) {
  return (
    <div 
      className="w-full h-full cursor-pointer preserve-3d"
      onClick={onFlip}
      style={{ 
        transformStyle: "preserve-3d",
        WebkitTransformStyle: "preserve-3d",
      }}
    >
      <motion.div 
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 25 }}
        style={{ 
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
        }}
      >
        {/* Front */}
        <Card 
          className="card-front absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-10 text-center bg-white dark:bg-gray-800 border-0 shadow-2xl shadow-blue-200/50 dark:shadow-none rounded-3xl overflow-hidden"
          style={{ 
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
            WebkitTransform: "rotateY(0deg)",
          }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-linear-to-br from-brand-100/50 to-transparent rounded-full -translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-linear-to-tl from-indigo-100/50 to-transparent rounded-full translate-x-12 translate-y-12" />
          
          {/* Level Badge */}
          {level && (
            <div className="absolute top-4 right-4">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${levelColors[level]} text-white shadow-sm`}>
                {level}
              </span>
            </div>
          )}
          
          {/* Word */}
          <div className="flex-1 flex flex-col items-center justify-center relative z-10">
            <span className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3 select-none">
              {word}
            </span>
            {ipa && (
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl text-muted-foreground font-mono select-none">
                  /{ipa}/
                </span>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-brand-600">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          {/* Hint */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium select-none">
              {flipHint}
            </p>
          </div>
        </Card>

        {/* Back */}
        <Card 
          className="card-back absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-10 text-center bg-linear-to-br from-brand-50 to-indigo-50 dark:from-brand-900/30 dark:to-indigo-900/30 border-2 border-brand-200/50 dark:border-brand-700/30 shadow-xl rounded-3xl"
          style={{ 
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            WebkitTransform: "rotateY(180deg)",
          }}
        >
          <div className="flex-1 flex flex-col items-center justify-center w-full gap-6">
            {/* Meaning */}
            <h3 className="text-2xl sm:text-3xl font-semibold text-brand-800 dark:text-brand-200 select-none">
              {meaning}
            </h3>
            
            {/* Example */}
            {example && (
              <div className="w-full max-w-md p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-brand-100/50 dark:border-brand-800/50">
                <p className="text-base italic text-gray-600 dark:text-gray-300 leading-relaxed">
                  "{example}"
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
