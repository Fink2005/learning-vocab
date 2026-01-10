import { Button } from "@/components/ui/button";
import { RotateCw, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface CompletionScreenProps {
  onRestart: () => void;
  onExit: () => void;
  congratsTitle?: string;
  congratsMessage?: string;
  restartLabel?: string;
  exitLabel?: string;
}

export function CompletionScreen({
  onRestart,
  onExit,
  congratsTitle = "Congratulations!",
  congratsMessage = "You have completed all cards.",
  restartLabel = "Restart",
  exitLabel = "Exit",
}: CompletionScreenProps) {
  return (
    <div className="h-[calc(100dvh-64px)] bg-linear-to-br from-green-50 via-emerald-50 to-teal-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-28 h-28 bg-linear-to-br from-green-400 to-emerald-500 text-white rounded-full flex items-center justify-center mb-8 shadow-xl shadow-green-200 dark:shadow-none"
      >
        <Sparkles className="h-14 w-14" />
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold mb-3 bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
      >
        {congratsTitle}
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground mb-10 text-lg max-w-sm"
      >
        {congratsMessage}
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col gap-4 w-full max-w-sm"
      >
        <Button 
          variant="outline" 
          size="lg" 
          onClick={onRestart} 
          className="w-full bg-white/80 backdrop-blur-sm"
        >
          <RotateCw className="h-4 w-4 mr-2" />
          {restartLabel}
        </Button>
        <Button 
          size="lg" 
          onClick={onExit} 
          className="w-full bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
        >
          {exitLabel}
        </Button>
      </motion.div>
    </div>
  );
}
