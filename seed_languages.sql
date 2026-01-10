-- Seed Level Systems
INSERT INTO level_systems (code, name) VALUES
  ('cefr', 'Common European Framework of Reference for Languages'),
  ('jlpt', 'Japanese-Language Proficiency Test'),
  ('hsk', 'Hanyu Shuiping Kaoshi')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;

-- Seed Languages
-- Note: Assuming level_systems have been inserted and we can look them up, 
-- or simpler: just inserting string codes if level_system column is text (from types it looks like text enum in TS but typically FK in DB)
-- If it's a FK, we need the UUID.
-- However, typically in these small apps, code might be used as ID or it's a direct string column.
-- Based on the provided types, `Language` has `level_system` which is a `LevelSystemCode` string.
-- It's common to use the ID if normalized, but let's assume strict FKs for now.
-- Actually, the `useLanguages` hook returns `level_system` as a string code 'cefr', 'jlpt' etc.
-- If the DB schema uses UUIDs for `level_systems`, then `languages.level_system_id` would be the column.
-- BUT the typescript interface `Language` has: `level_system: LevelSystemCode;` (string)
-- Use `level_system` column as text/enum if that's how it's defined. 
-- If it's a relation, Supabase generation often names it `level_system_id` or similar.
-- Let's try to assume it matches the TS type `level_system` (string code).

INSERT INTO languages (code, name, native_name, level_system, is_active) VALUES
  ('en', 'English', 'English', 'cefr', true),
  ('de', 'German', 'Deutsch', 'cefr', true),
  ('ja', 'Japanese', '日本語', 'jlpt', true),
  ('zh', 'Chinese', '中文', 'hsk', true),
  ('fr', 'French', 'Français', 'cefr', true),
  ('es', 'Spanish', 'Español', 'cefr', true),
  ('ko', 'Korean', '한국어', 'cefr', true), -- Fallback to CEFR as TOPIK not yet implemented
  ('vi', 'Vietnamese', 'Tiếng Việt', 'cefr', true)
ON CONFLICT (code) DO UPDATE SET 
  name = EXCLUDED.name,
  native_name = EXCLUDED.native_name,
  level_system = EXCLUDED.level_system,
  is_active = EXCLUDED.is_active;

-- Seed Levels (Optional if UI uses hardcoded constants, but good for completeness)
-- CEFR
INSERT INTO levels (code, name, system_id, sort_order) 
SELECT 'A1', 'Beginner', id, 1 FROM level_systems WHERE code = 'cefr'
UNION ALL SELECT 'A2', 'Elementary', id, 2 FROM level_systems WHERE code = 'cefr'
UNION ALL SELECT 'B1', 'Intermediate', id, 3 FROM level_systems WHERE code = 'cefr'
UNION ALL SELECT 'B2', 'Upper Intermediate', id, 4 FROM level_systems WHERE code = 'cefr'
UNION ALL SELECT 'C1', 'Advanced', id, 5 FROM level_systems WHERE code = 'cefr'
UNION ALL SELECT 'C2', 'Proficiency', id, 6 FROM level_systems WHERE code = 'cefr';

-- JLPT
INSERT INTO levels (code, name, system_id, sort_order) 
SELECT 'N5', 'Beginner', id, 1 FROM level_systems WHERE code = 'jlpt'
UNION ALL SELECT 'N4', 'Basic', id, 2 FROM level_systems WHERE code = 'jlpt'
UNION ALL SELECT 'N3', 'Intermediate', id, 3 FROM level_systems WHERE code = 'jlpt'
UNION ALL SELECT 'N2', 'Advanced', id, 4 FROM level_systems WHERE code = 'jlpt'
UNION ALL SELECT 'N1', 'Proficiency', id, 5 FROM level_systems WHERE code = 'jlpt';

-- HSK
INSERT INTO levels (code, name, system_id, sort_order) 
SELECT 'HSK1', 'Level 1', id, 1 FROM level_systems WHERE code = 'hsk'
UNION ALL SELECT 'HSK2', 'Level 2', id, 2 FROM level_systems WHERE code = 'hsk'
UNION ALL SELECT 'HSK3', 'Level 3', id, 3 FROM level_systems WHERE code = 'hsk'
UNION ALL SELECT 'HSK4', 'Level 4', id, 4 FROM level_systems WHERE code = 'hsk'
UNION ALL SELECT 'HSK5', 'Level 5', id, 5 FROM level_systems WHERE code = 'hsk'
UNION ALL SELECT 'HSK6', 'Level 6', id, 6 FROM level_systems WHERE code = 'hsk';
