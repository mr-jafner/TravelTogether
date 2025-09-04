-- Migration 001: Add Permission System Support
-- Add creator tracking and role-based permissions

-- Add created_by column to trips table if it doesn't exist
ALTER TABLE trips ADD COLUMN created_by TEXT;

-- Add role column to participants table if it doesn't exist  
ALTER TABLE participants ADD COLUMN role TEXT DEFAULT 'participant';

-- For existing trips without a creator, set the first participant as creator
UPDATE participants 
SET role = 'creator' 
WHERE id IN (
  SELECT MIN(p.id) 
  FROM participants p
  JOIN trips t ON p.trip_id = t.id
  WHERE t.created_by IS NULL
  GROUP BY p.trip_id
);

-- Update trips table to set created_by based on creator participants
UPDATE trips 
SET created_by = (
  SELECT p.name 
  FROM participants p 
  WHERE p.trip_id = trips.id AND p.role = 'creator' 
  LIMIT 1
)
WHERE created_by IS NULL;

-- Create index for faster permission checks
CREATE INDEX IF NOT EXISTS idx_participants_role ON participants (trip_id, role);
CREATE INDEX IF NOT EXISTS idx_trips_created_by ON trips (created_by);