import React, { createContext, useContext, useState, useEffect } from "react";
import { useLanguages } from "@/hooks/useLanguages";
import type { Language } from "@/types";

interface LanguageContextType {
  currentLanguageId: string | null;
  setLanguageId: (id: string) => void;
  currentLanguage: Language | undefined;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { data: languages, isLoading } = useLanguages();
  const [currentLanguageId, setCurrentLanguageId] = useState<string | null>(
    localStorage.getItem("vocab_duck_lang")
  );

  useEffect(() => {
    if (!isLoading && languages && languages.length > 0) {
      if (!currentLanguageId) {
        // Default to English or first available
        const defaultLang = languages.find((l) => l.code === "en") || languages[0];
        setCurrentLanguageId(defaultLang.id);
        localStorage.setItem("vocab_duck_lang", defaultLang.id);
      } else {
         // Verify locally stored ID still exists
         const exists = languages.find(l => l.id === currentLanguageId);
         if (!exists) {
            const defaultLang = languages.find((l) => l.code === "en") || languages[0];
            setCurrentLanguageId(defaultLang.id);
            localStorage.setItem("vocab_duck_lang", defaultLang.id);
         }
      }
    }
  }, [languages, isLoading, currentLanguageId]);

  const setLanguageId = (id: string) => {
    setCurrentLanguageId(id);
    localStorage.setItem("vocab_duck_lang", id);
  };

  const currentLanguage = languages?.find((l) => l.id === currentLanguageId);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguageId,
        setLanguageId,
        currentLanguage,
        isLoading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
