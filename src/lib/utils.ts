import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLanguageFlag(code: string): string {
  const flags: Record<string, string> = {
    en: "🇬🇧",
    de: "🇩🇪",
    ja: "🇯🇵",
    zh: "🇨🇳",
    vi: "🇻🇳",
    fr: "🇫🇷",
    es: "🇪🇸",
    ko: "🇰🇷",
  };
  return flags[code] || "🌐";
}
