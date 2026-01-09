export type VocabularyLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface Vocabulary {
  id: string;
  user_id: string;
  word: string;
  meaning: string;
  example: string | null;
  level: VocabularyLevel;
  notes: string | null;
  created_at: string;
  updated_at: string;
  synonyms?: Synonym[];
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
  level: VocabularyLevel;
  notes?: string;
  synonyms?: string[];
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
