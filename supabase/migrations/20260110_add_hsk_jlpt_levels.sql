-- Add HSK and JLPT levels to vocabulary_level enum
-- This migration adds support for Chinese (HSK) and Japanese (JLPT) level systems

-- Add JLPT levels (Japanese)
ALTER TYPE vocabulary_level ADD VALUE IF NOT EXISTS 'N5';
ALTER TYPE vocabulary_level ADD VALUE IF NOT EXISTS 'N4';
ALTER TYPE vocabulary_level ADD VALUE IF NOT EXISTS 'N3';
ALTER TYPE vocabulary_level ADD VALUE IF NOT EXISTS 'N2';
ALTER TYPE vocabulary_level ADD VALUE IF NOT EXISTS 'N1';

-- Add HSK levels (Chinese)
ALTER TYPE vocabulary_level ADD VALUE IF NOT EXISTS 'HSK1';
ALTER TYPE vocabulary_level ADD VALUE IF NOT EXISTS 'HSK2';
ALTER TYPE vocabulary_level ADD VALUE IF NOT EXISTS 'HSK3';
ALTER TYPE vocabulary_level ADD VALUE IF NOT EXISTS 'HSK4';
ALTER TYPE vocabulary_level ADD VALUE IF NOT EXISTS 'HSK5';
ALTER TYPE vocabulary_level ADD VALUE IF NOT EXISTS 'HSK6';
