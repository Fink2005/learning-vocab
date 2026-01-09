import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { useVocabularies } from "@/hooks/useVocabulary";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import {
  BookOpen,
  TrendingUp,
  Target,
  LogOut,
  Moon,
  Sun,
  ChevronRight,
} from "lucide-react";
import type { VocabularyLevel } from "@/types";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const { data: vocabularies } = useVocabularies();
  const [darkMode, setDarkMode] = useState(false);

  // Check for dark mode on mount
  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  if (!loading && !user) {
    return <Navigate to="/login" />;
  }

  // Calculate stats
  const totalWords = vocabularies?.length || 0;
  const totalSynonyms =
    vocabularies?.reduce((acc, vocab) => acc + (vocab.synonyms?.length || 0), 0) || 0;

  const levelCounts = vocabularies?.reduce(
    (acc, vocab) => {
      acc[vocab.level] = (acc[vocab.level] || 0) + 1;
      return acc;
    },
    {} as Record<VocabularyLevel, number>
  );

  const levels: VocabularyLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const levelColors: Record<VocabularyLevel, string> = {
    A1: "bg-emerald-500",
    A2: "bg-green-500",
    B1: "bg-amber-500",
    B2: "bg-orange-500",
    C1: "bg-rose-500",
    C2: "bg-purple-500",
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 pb-4">
      {/* Profile Header */}
      <div className="bg-brand-700 text-white px-4 pt-4 pb-16 -mt-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <Avatar className="h-20 w-20 border-4 border-white/30">
            <AvatarImage src={user?.avatar_url} alt={user?.full_name} />
            <AvatarFallback className="bg-white/20 text-white text-2xl">
              {user?.full_name?.charAt(0) || user?.email?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-bold mt-3">{user?.full_name || "User"}</h1>
          <p className="text-white/70 text-sm">{user?.email}</p>
        </motion.div>
      </div>

      <div className="px-4 -mt-10 space-y-4">
        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
                  <BookOpen className="h-6 w-6 mx-auto text-brand-700 mb-1" />
                  <p className="text-2xl font-bold text-brand-900 dark:text-brand-200">
                    {totalWords}
                  </p>
                  <p className="text-xs text-muted-foreground">Từ vựng</p>
                </div>
                <div className="text-center p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
                  <TrendingUp className="h-6 w-6 mx-auto text-brand-500 mb-1" />
                  <p className="text-2xl font-bold text-brand-900 dark:text-brand-200">
                    {totalSynonyms}
                  </p>
                  <p className="text-xs text-muted-foreground">Synonyms</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-brand-700" />
                <h3 className="font-semibold">Tiến độ theo Level</h3>
              </div>
              <div className="space-y-3">
                {levels.map((level) => {
                  const count = levelCounts?.[level] || 0;
                  const maxCount = Math.max(
                    ...Object.values(levelCounts || {}).map(Number),
                    1
                  );
                  const percentage = (count / maxCount) * 100;

                  return (
                    <div key={level} className="flex items-center gap-3">
                      <span className="w-8 text-sm font-medium">{level}</span>
                      <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.3 + levels.indexOf(level) * 0.1, duration: 0.5 }}
                          className={`h-full ${levelColors[level]} rounded-full`}
                        />
                      </div>
                      <span className="w-8 text-right text-sm text-muted-foreground">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
            <CardContent className="p-0">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {darkMode ? (
                    <Moon className="h-5 w-5 text-brand-700" />
                  ) : (
                    <Sun className="h-5 w-5 text-brand-700" />
                  )}
                  <span className="font-medium">Chế độ tối</span>
                </div>
                <div
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    darkMode ? "bg-brand-700" : "bg-gray-200"
                  }`}
                >
                  <motion.div
                    layout
                    className={`w-4 h-4 bg-white rounded-full shadow ${
                      darkMode ? "ml-6" : "ml-0"
                    }`}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
              </button>

              <div className="h-px bg-gray-100 dark:bg-gray-700" />

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-red-500"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Đăng xuất</span>
                </div>
                <ChevronRight className="h-5 w-5 opacity-50" />
              </button>
            </CardContent>
          </Card>
        </motion.div>

        {/* App Version */}
        <p className="text-center text-xs text-muted-foreground pt-4">
          VocabDuck v1.0.0
        </p>
      </div>
    </div>
  );
}
