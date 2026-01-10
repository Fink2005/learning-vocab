-- Migration: Add word_type to vocabularies and linked synonyms
-- Run this on Supabase SQL Editor

-- Create word_type enum for parts of speech
CREATE TYPE word_type AS ENUM (
  'noun',        -- danh từ
  'verb',        -- động từ  
  'adjective',   -- tính từ
  'adverb',      -- trạng từ
  'pronoun',     -- đại từ
  'preposition', -- giới từ
  'conjunction', -- liên từ
  'interjection', -- thán từ
  'phrase'       -- cụm từ
);

-- Add word_type column to vocabularies table
ALTER TABLE vocabularies 
ADD COLUMN IF NOT EXISTS word_type word_type NULL;

-- Add linked_vocabulary_id to synonyms table (references existing vocabulary)
ALTER TABLE synonyms 
ADD COLUMN IF NOT EXISTS linked_vocabulary_id UUID REFERENCES vocabularies(id) ON DELETE SET NULL;

-- Create index for better performance on linked_vocabulary_id
CREATE INDEX IF NOT EXISTS idx_synonyms_linked_vocabulary_id ON synonyms(linked_vocabulary_id);

-- Comment for documentation
COMMENT ON COLUMN vocabularies.word_type IS 'Part of speech: noun, verb, adjective, etc.';
COMMENT ON COLUMN synonyms.linked_vocabulary_id IS 'Reference to existing vocabulary entry if synonym is linked';
