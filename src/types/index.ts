// Level systems
export type LevelSystemCode = "cefr" | "jlpt" | "hsk";

// CEFR levels (English, German)
export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
// JLPT levels (Japanese)
export type JLPTLevel = "N5" | "N4" | "N3" | "N2" | "N1";
// HSK levels (Chinese)
export type HSKLevel = "HSK1" | "HSK2" | "HSK3" | "HSK4" | "HSK5" | "HSK6";

// Combined vocabulary level type
export type VocabularyLevel = CEFRLevel | JLPTLevel | HSKLevel;

// Language interface
export interface Language {
  id: string;
  code: string;
  name: string;
  native_name: string | null;
  level_system: LevelSystemCode;
  is_active: boolean;
  created_at: string;
}

// Level system interface
export interface LevelSystem {
  id: string;
  code: LevelSystemCode;
  name: string;
}

// Level interface
export interface Level {
  id: string;
  system_id: string;
  code: string;
  name: string | null;
  sort_order: number;
}

export interface Vocabulary {
  id: string;
  user_id: string;
  word: string;
  meaning: string;
  example: string | null;
  ipa: string | null;
  level: VocabularyLevel;
  notes: string | null;
  target_language_id: string;
  created_at: string;
  updated_at: string;
  synonyms?: Synonym[];
  language?: Language;
}

export interface Synonym {
  id: string;
  vocabulary_id: string;
  synonym: string;
  notes: string | null;
  created_at: string;
}

export interface CreateVocabularyInput {
  word: string;
  meaning: string;
  example?: string;
  ipa?: string;
  level: VocabularyLevel;
  notes?: string;
  synonyms?: string[];
  target_language_id?: string; // Optional for backward compatibility
}

export interface UpdateVocabularyInput extends Partial<CreateVocabularyInput> {
  id: string;
}

export interface CreateSynonymInput {
  vocabulary_id: string;
  synonym: string;
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export interface StudySet {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  target_language_id: string;
  created_at: string;
  updated_at: string;
  _count?: {
    items: number;
  };
}

export interface StudySetItem {
  id: string;
  study_set_id: string;
  vocabulary_id: string;
  added_at: string;
  vocabulary?: Vocabulary;
}

export interface CreateStudySetInput {
  title: string;
  description?: string;
  target_language_id: string;
}

export interface UpdateStudySetInput extends Partial<CreateStudySetInput> {
  id: string;
}

