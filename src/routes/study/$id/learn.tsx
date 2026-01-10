import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useStudySet } from "@/hooks/useStudySets";
import { useStudySetItems } from "@/hooks/useStudySetItems";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, RotateCw, Shuffle, Sparkles, BookOpen, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { levelColors } from "@/lib/levels";

export const Route = createFileRoute("/study/$id/learn")({
  component: LearnStudySetPage,
});

function LearnStudySetPage() {
  const { id } = Route.useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const { data: studySet } = useStudySet(id);
  const { data: items, isLoading } = useStudySetItems(id);
  
  const [cards, setCards] = useState<typeof items>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next

  useEffect(() => {
    if (items) {
      setCards([...items]);
    }
  }, [items]);

  const handleNext = () => {
    setIsFlipped(false);
    setDirection(1);
    if (currentIndex < (cards?.length || 0) - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 100);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setDirection(-1);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 100);
    }
  };

  const handleShuffle = () => {
    if (cards) {
        const shuffled = [...cards].sort(() => Math.random() - 0.5);
        setCards(shuffled);
        setCurrentIndex(0);
        setIsFlipped(false);
        setIsFinished(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsFinished(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (!studySet || !cards || cards.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No cards yet</h2>
          <p className="text-muted-foreground mb-6">Add some vocabulary to start learning</p>
          <Button onClick={() => navigate({ to: `/study/${id}/edit` })} className="bg-brand-700 hover:bg-brand-800">
            Add Cards
          </Button>
        </div>
      </div>
    );
  }

  // Finished view
  if (isFinished) {
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
          {t("study.congrats")}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground mb-10 text-lg max-w-sm"
        >
          {t("study.completed")}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-4 w-full max-w-sm"
        >
          <Button variant="outline" size="lg" onClick={handleRestart} className="w-full bg-white/80 backdrop-blur-sm">
            <RotateCw className="h-4 w-4 mr-2" />
            {t("study.restart")}
          </Button>
          <Button size="lg" onClick={() => navigate({ to: "/study" })} className="w-full bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg">
            {t("study.title")}
          </Button>
        </motion.div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  // Card animation variants
  const cardVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <div className="h-[calc(100dvh-64px)] overflow-hidden bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-white/50 dark:border-gray-800 shrink-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/study" })} className="hover:bg-white/50 dark:hover:bg-gray-800/50">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex flex-col items-center">
            <h1 className="font-semibold text-sm text-gray-800 dark:text-gray-200">{studySet.title}</h1>
            <span className="text-xs text-muted-foreground">{currentIndex + 1} of {cards.length}</span>
          </div>
          
          <Button variant="ghost" size="icon" onClick={handleShuffle} title={t("study.shuffle")} className="hover:bg-white/50 dark:hover:bg-gray-800/50">
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

      {/* Card Area */}
      <div className="flex-1 container mx-auto px-4 py-2 sm:p-4 flex flex-col items-center justify-center min-h-0 overflow-hidden">
        
        <div className="w-full max-w-md h-[60vh] max-h-[400px] perspective-1000 relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div 
              key={currentIndex}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full h-full"
            >
              <div 
                className="w-full h-full cursor-pointer preserve-3d"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <motion.div 
                  className="w-full h-full relative"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 25 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Front */}
                  <Card className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-6 sm:p-10 text-center bg-white dark:bg-gray-800 border-0 shadow-2xl shadow-blue-200/50 dark:shadow-none rounded-3xl overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-linear-to-br from-brand-100/50 to-transparent rounded-full -translate-x-16 -translate-y-16" />
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-linear-to-tl from-indigo-100/50 to-transparent rounded-full translate-x-12 translate-y-12" />
                    
                    {/* Level Badge */}
                    {currentCard?.vocabulary?.level && (
                      <div className="absolute top-4 right-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${levelColors[currentCard.vocabulary.level]} text-white shadow-sm`}>
                          {currentCard.vocabulary.level}
                        </span>
                      </div>
                    )}
                    
                    {/* Word */}
                    <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                      <span className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3 select-none">
                        {currentCard?.vocabulary?.word}
                      </span>
                      {currentCard?.vocabulary?.ipa && (
                        <div className="flex items-center gap-2">
                          <span className="text-lg sm:text-xl text-muted-foreground font-mono select-none">
                            /{currentCard?.vocabulary?.ipa}/
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
                        {t("study.flip")}
                      </p>
                    </div>
                  </Card>

                  {/* Back */}
                  <Card 
                    className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-6 sm:p-10 text-center bg-linear-to-br from-brand-50 to-indigo-50 dark:from-brand-900/30 dark:to-indigo-900/30 border-2 border-brand-200/50 dark:border-brand-700/30 shadow-xl rounded-3xl" 
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    <div className="flex-1 flex flex-col items-center justify-center w-full gap-6">
                      {/* Meaning */}
                      <h3 className="text-2xl sm:text-3xl font-semibold text-brand-800 dark:text-brand-200 select-none">
                        {currentCard?.vocabulary?.meaning}
                      </h3>
                      
                      {/* Example */}
                      {currentCard?.vocabulary?.example && (
                        <div className="w-full max-w-md p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-brand-100/50 dark:border-brand-800/50">
                          <p className="text-base italic text-gray-600 dark:text-gray-300 leading-relaxed">
                            "{currentCard.vocabulary.example}"
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <p className="mt-6 text-xs text-muted-foreground/50 hidden sm:block select-none">
          Click card to flip • Use arrows or buttons to navigate
        </p>
      </div>

      {/* Controls */}
      <div className="p-4 sm:p-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-t border-white/50 dark:border-gray-800 shrink-0">
        <div className="container mx-auto max-w-lg flex items-center justify-center gap-4">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handlePrev} 
            className="flex-1 h-12 bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            {t("study.prev")}
          </Button>
          
          <Button 
            size="lg" 
            onClick={handleNext}
            className="flex-2 h-12 bg-linear-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white shadow-lg shadow-brand-200/50 dark:shadow-none rounded-xl text-base font-semibold"
          >
            {currentIndex === cards.length - 1 ? t("study.finish") : t("study.next")}
            {currentIndex !== cards.length - 1 && <ChevronRight className="h-5 w-5 ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
