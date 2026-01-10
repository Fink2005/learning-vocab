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
  ChevronLeft,
  Bell,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { VocabularyLevel } from "@/types";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { levelProgressColors, getLevelsForSystem } from "@/lib/levels";
import { useLanguages } from "@/hooks/useLanguages";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLanguageFlag } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { t, i18n } = useTranslation();
  const { user, loading, signOut } = useAuth();
  const { currentLanguageId, setLanguageId } = useLanguage();
  const { data: vocabularies } = useVocabularies();
  const { data: languages = [] } = useLanguages();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default");

  // Check for dark mode on mount
  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));
    
    // Check notification status
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
      setNotificationsEnabled(Notification.permission === "granted");
    }
  }, []);

  const toggleNotifications = async () => {
    if (!("Notification" in window)) {
      alert(t("profile.browserNotSupported"));
      return;
    }

    if (notificationsEnabled) {
      // Cannot programmatically revoke permission, just update state simulation
      // real app would unsubscribe from push server
      setNotificationsEnabled(false);
    } else {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === "granted") {
        setNotificationsEnabled(true);
        new Notification(i18n.language === "vi" ? "Xin chào! 👋" : "Hello! 👋", {
          body: t("profile.notificationEnabled"),
          icon: "/logo192.png"
        });
      }
    }
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  if (!loading && !user) {
    return <Navigate to="/login" />;
  }

  // Filter vocabularies by selected language
  const filteredVocabularies = vocabularies?.filter(
    v => !v.target_language_id || v.target_language_id === currentLanguageId
  ) || [];

  // Calculate stats
  const totalWords = filteredVocabularies.length;
  const totalSynonyms =
    filteredVocabularies.reduce((acc, vocab) => acc + (vocab.synonyms?.length || 0), 0) || 0;

  const levelCounts = filteredVocabularies.reduce(
    (acc, vocab) => {
      acc[vocab.level] = (acc[vocab.level] || 0) + 1;
      return acc;
    },
    {} as Record<VocabularyLevel, number>
  );

  const selectedLanguage = languages.find(l => l.id === currentLanguageId);
  const levels = getLevelsForSystem(selectedLanguage?.level_system || "cefr");

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 sm:pb-4 pb-20 relative overflow-x-hidden">
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
                  <p className="text-xs text-muted-foreground">{t("profile.vocabularyCount")}</p>
                </div>
                <div className="text-center p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
                  <TrendingUp className="h-6 w-6 mx-auto text-brand-500 mb-1" />
                  <p className="text-2xl font-bold text-brand-900 dark:text-brand-200">
                    {totalSynonyms}
                  </p>
                  <p className="text-xs text-muted-foreground">{t("profile.synonymCount")}</p>
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-brand-700" />
                  <h3 className="font-semibold">{t("profile.levelProgress")}</h3>
                </div>
                {selectedLanguage && (
                  <Badge variant="secondary" className="bg-brand-50 text-brand-700 border-brand-200">
                    <span className="mr-1 text-base">{getLanguageFlag(selectedLanguage.code)}</span>
                    {selectedLanguage.name}
                  </Badge>
                )}
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
                          className={`h-full ${levelProgressColors[level]} rounded-full`}
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
              {/* App Language Toggle */}
              <button
                onClick={() => i18n.changeLanguage(i18n.language === "vi" ? "en" : "vi")}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex flex-col">
                    <span className="font-medium block">{t("profile.language")}</span>
                    <span className="text-sm text-muted-foreground text-left">
                      {i18n.language === "vi" ? "Tiếng Việt" : "English"}
                    </span>
                </div>
                <ChevronRight className="h-5 w-5 opacity-50" />
              </button>

              <div className="h-px bg-gray-100 dark:bg-gray-700" />
              
              {/* Learning Language Selector Button */}
               <button
                onClick={() => setShowLanguageSelector(true)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-5 h-5">
                    <span className="text-xl leading-none">
                       {selectedLanguage ? getLanguageFlag(selectedLanguage.code) : "🌐"}
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="font-medium block">Ngôn ngữ đang học</span>
                    <span className="text-xs text-muted-foreground">
                      {selectedLanguage?.name || "Chọn ngôn ngữ"}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 opacity-50" />
              </button>

              <div className="h-px bg-gray-100 dark:bg-gray-700" />

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
                  <span className="font-medium">{t("profile.darkMode")}</span>
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

              {/* Notification Toggle */}
              <button
                onClick={toggleNotifications}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                disabled={notificationPermission === "denied"}
              >
                <div className="flex items-center gap-3">
                  <Bell className={`h-5 w-5 ${notificationsEnabled ? "text-brand-700" : "text-gray-400"}`} />
                  <div className="text-left">
                    <span className="font-medium block">{t("profile.notifications")}</span>
                    {notificationPermission === "denied" && (
                      <span className="text-xs text-red-500">{t("profile.notificationBlocked")}</span>
                    )}
                  </div>
                </div>
                <div
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    notificationsEnabled ? "bg-brand-700" : "bg-gray-200"
                  }`}
                >
                  <motion.div
                    layout
                    className={`w-4 h-4 bg-white rounded-full shadow ${
                      notificationsEnabled ? "ml-6" : "ml-0"
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
                  <span className="font-medium">{t("profile.signOut")}</span>
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

     {/* Language Selector Full Screen Overlay */}
     <AnimatePresence>
        {showLanguageSelector && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-gray-50 dark:bg-gray-900 flex flex-col"
          >
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3 shadow-sm shrink-0">
              <button
                onClick={() => setShowLanguageSelector(false)}
                className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <h2 className="text-lg font-semibold">Chọn ngôn ngữ học</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24 scrollbar-hide">
               {languages.map((lang) => {
                 const isSelected = currentLanguageId === lang.id;
                 return (
                  <motion.button
                    key={lang.id}
                    onClick={() => {
                      setLanguageId(lang.id);
                      setTimeout(() => setShowLanguageSelector(false), 300);
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center p-4 rounded-xl border transition-all ${
                      isSelected 
                        ? "bg-brand-50 dark:bg-brand-900/20 border-brand-500 ring-1 ring-brand-500" 
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-brand-200"
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-4xl drop-shadow-sm">{getLanguageFlag(lang.code)}</span>
                      <div className="text-left">
                        <p className={`font-semibold text-lg ${isSelected ? "text-brand-900 dark:text-brand-100" : ""}`}>
                          {lang.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {isSelected ? "Đang học" : "Nhấn để chọn"}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="h-6 w-6 rounded-full bg-brand-500 flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </motion.button>
                 );
               })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
