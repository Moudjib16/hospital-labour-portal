-- Enable the unaccent extension so full-text search ignores accents
-- (e.g. "cesarienne" matches "Césarienne").
CREATE EXTENSION IF NOT EXISTS unaccent;