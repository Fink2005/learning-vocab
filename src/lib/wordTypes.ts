import type { WordType } from "@/types";

// Word type labels in Vietnamese
export const wordTypeLabels: Record<WordType, string> = {
  noun: "Danh từ",
  verb: "Động từ",
  adjective: "Tính từ",
  adverb: "Trạng từ",
  pronoun: "Đại từ",
  preposition: "Giới từ",
  conjunction: "Liên từ",
  interjection: "Thán từ",
  phrase: "Cụm từ",
};

// Word type labels in English
export const wordTypeLabelsEn: Record<WordType, string> = {
  noun: "Noun",
  verb: "Verb",
  adjective: "Adjective",
  adverb: "Adverb",
  pronoun: "Pronoun",
  preposition: "Preposition",
  conjunction: "Conjunction",
  interjection: "Interjection",
  phrase: "Phrase",
};

// Word type colors
export const wordTypeColors: Record<WordType, string> = {
  noun: "bg-blue-100 text-blue-700 border-blue-200",
  verb: "bg-green-100 text-green-700 border-green-200",
  adjective: "bg-purple-100 text-purple-700 border-purple-200",
  adverb: "bg-orange-100 text-orange-700 border-orange-200",
  pronoun: "bg-pink-100 text-pink-700 border-pink-200",
  preposition: "bg-cyan-100 text-cyan-700 border-cyan-200",
  conjunction: "bg-yellow-100 text-yellow-700 border-yellow-200",
  interjection: "bg-red-100 text-red-700 border-red-200",
  phrase: "bg-gray-100 text-gray-700 border-gray-200",
};

// All word types for iteration
export const allWordTypes: WordType[] = [
  "noun",
  "verb",
  "adjective",
  "adverb",
  "pronoun",
  "preposition",
  "conjunction",
  "interjection",
  "phrase",
];
