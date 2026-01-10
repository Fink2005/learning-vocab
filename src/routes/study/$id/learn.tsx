import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useStudySet } from "@/hooks/useStudySets";
import { useStudySetItems } from "@/hooks/useStudySetItems";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, RotateCw, Shuffle } from "lucide-react";
import { motion } from "framer-motion";

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

  useEffect(() => {
    if (items) {
      setCards([...items]);
    }
  }, [items]);

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < (cards?.length || 0) - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
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
    return <div className="p-8 text-center">{t("common.loading")}</div>;
  }

  if (!studySet || !cards || cards.length === 0) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
            <p className="mb-4 text-muted-foreground">No cards to learn in this set.</p>
            <Button onClick={() => navigate({ to: `/study/${id}/edit` })}>
                Add Cards
            </Button>
        </div>
    );
  }

  // Finished view
  if (isFinished) {
      return (
          <div className="min-h-screen bg-linear-to-b from-brand-50 to-white dark:from-gray-900 dark:to-black flex flex-col items-center justify-center p-4 text-center">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <span className="text-4xl">🎉</span>
              </div>
              <h1 className="text-3xl font-bold mb-3 text-brand-900 dark:text-brand-100">{t("study.congrats")}</h1>
              <p className="text-muted-foreground mb-10 text-lg max-w-sm">{t("study.completed")}</p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
                  <Button variant="outline" size="lg" onClick={handleRestart} className="w-full">
                      <RotateCw className="h-4 w-4 mr-2" />
                      {t("study.restart")}
                  </Button>
                  <Button size="lg" onClick={() => navigate({ to: "/study" })} className="w-full bg-brand-700 hover:bg-brand-800">
                      {t("study.title")}
                  </Button>
              </div>
          </div>
      );
  }

  const currentCard = cards[currentIndex];
  // Calculate progress percentage
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="md:min-h-full min-h-[calc(100vh-130px)] overflow-hidden bg-linear-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shrink-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/study" })}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <div className="flex flex-col items-center">
             <h1 className="font-semibold text-sm sm:text-base">{studySet.title}</h1>
          </div>
          
          <Button variant="ghost" size="icon" onClick={handleShuffle} title={t("study.shuffle")}>
            <Shuffle className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 w-full bg-gray-100 dark:bg-gray-800">
            <div 
                className="h-full bg-brand-500 transition-all duration-300" 
                style={{ width: `${progress}%` }}
            />
        </div>
      </div>

      {/* Card Area */}
      <div className="flex-1 container mx-auto p-4 sm:p-6 flex flex-col items-center justify-center overflow-y-auto min-h-0">
        
        <div className="text-sm text-muted-foreground mb-4 font-medium tracking-wide shrink-0">
            {currentIndex + 1} / {cards.length}
        </div>

        <div className="w-full max-w-2xl aspect-3/2 sm:aspect-video perspective-1000 relative shrink-0" onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div 
               className="w-full h-full relative preserve-3d cursor-pointer"
               animate={{ rotateY: isFlipped ? 180 : 0 }}
               transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 25 }}
               style={{ transformStyle: "preserve-3d" }}
            >
                {/* Front */}
                <Card className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white dark:bg-gray-800 border-0 shadow-2xl rounded-3xl hover:shadow-brand-100/50 dark:hover:shadow-brand-900/30 transition-shadow">
                    <span className="text-4xl sm:text-6xl font-bold text-brand-900 dark:text-brand-100 mb-2 drop-shadow-sm select-none">
                        {currentCard?.vocabulary?.word}
                    </span>
                    {currentCard?.vocabulary?.ipa && (
                        <span className="text-xl sm:text-2xl text-muted-foreground font-serif mb-6 select-none opacity-80">
                            /{currentCard?.vocabulary?.ipa}/
                        </span>
                    )}
                    <div className="absolute bottom-8 left-0 right-0 text-center">
                        <p className="text-xs text-brand-300 uppercase tracking-[0.2em] font-medium select-none">
                            {t("study.flip")}
                        </p>
                    </div>
                </Card>

                {/* Back */}
                <Card className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-brand-50/50 dark:bg-brand-900/20 border-2 border-brand-100 dark:border-brand-800 shadow-xl rounded-3xl" style={{ transform: "rotateY(180deg)" }}>
                    <div className="flex-1 flex flex-col items-center justify-center w-full overflow-y-auto">
                        <h3 className="text-3xl sm:text-4xl font-semibold mb-6 text-brand-800 dark:text-brand-200 select-none">
                            {currentCard?.vocabulary?.meaning}
                        </h3>
                        {currentCard?.vocabulary?.example && (
                            <div className="w-full p-6 bg-white dark:bg-gray-800/50 rounded-2xl border border-brand-100 dark:border-brand-800/50 shadow-sm">
                                <p className="text-lg italic text-gray-600 dark:text-gray-300 font-serif leading-relaxed">
                                "{currentCard.vocabulary.example}"
                                </p>
                            </div>
                        )}
                    </div>
                </Card>
            </motion.div>
        </div>
        
        <p className="mt-8 text-sm text-muted-foreground/60 hidden sm:block shrink-0 select-none">
            Tip: Click card to flip
        </p>
      </div>

      {/* Controls */}
      <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] shrink-0">
          <div className="container mx-auto max-w-2xl flex items-center justify-between gap-6">
              <Button 
                variant="ghost" 
                size="lg" 
                onClick={handlePrev} 
                className="flex-1 text-gray-500 hover:text-brand-700 hover:bg-brand-50"
                disabled={currentIndex === 0}
              >
                  <ChevronLeft className="h-6 w-6 mr-1" />
                  <span className="font-medium">{t("study.prev")}</span>
              </Button>
              
              <Button 
                variant="default" 
                size="lg" 
                onClick={handleNext}
                className="flex-[2] bg-brand-600 bg-brand-700 text-white shadow-lg shadow-brand-200 dark:shadow-none h-14 rounded-xl text-lg"
              >
                  {currentIndex === cards.length - 1 ? "Finish" : t("study.next")}
                  {currentIndex !== cards.length - 1 && <ChevronRight className="h-6 w-6 ml-1" />}
              </Button>
          </div>
      </div>
    </div>
  );
}
