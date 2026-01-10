import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useStudySet } from "@/hooks/useStudySets";
import { useStudySetItems } from "@/hooks/useStudySetItems";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FlashCard, 
  LearnControls, 
  LearnHeader, 
  CompletionScreen 
} from "@/components/study";

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
  const [direction, setDirection] = useState(0);

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

  const handleBack = () => {
    navigate({ to: "/study" });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-[calc(100dvh-64px)] bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!studySet || !cards || cards.length === 0) {
    return (
      <div className="h-[calc(100dvh-64px)] bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
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

  // Finished state
  if (isFinished) {
    return (
      <CompletionScreen
        onRestart={handleRestart}
        onExit={handleBack}
        congratsTitle={t("study.congrats")}
        congratsMessage={t("study.completed")}
        restartLabel={t("study.restart")}
        exitLabel={t("study.title")}
      />
    );
  }

  const currentCard = cards[currentIndex];

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
      <LearnHeader
        title={studySet.title}
        currentIndex={currentIndex}
        total={cards.length}
        onBack={handleBack}
        onShuffle={handleShuffle}
        shuffleLabel={t("study.shuffle")}
      />

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
              <FlashCard
                word={currentCard?.vocabulary?.word || ""}
                meaning={currentCard?.vocabulary?.meaning || ""}
                ipa={currentCard?.vocabulary?.ipa}
                example={currentCard?.vocabulary?.example}
                level={currentCard?.vocabulary?.level}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(!isFlipped)}
                flipHint={t("study.flip")}
              />
            </motion.div>
          </AnimatePresence>
        </div>
        
        <p className="mt-6 text-xs text-muted-foreground/50 hidden sm:block select-none">
          Click card to flip • Use arrows or buttons to navigate
        </p>
      </div>

      {/* Controls */}
      <LearnControls
        onPrev={handlePrev}
        onNext={handleNext}
        hasPrev={currentIndex > 0}
        isLast={currentIndex === cards.length - 1}
        prevLabel={t("study.prev")}
        nextLabel={t("study.next")}
        finishLabel={t("study.finish")}
      />
    </div>
  );
}
