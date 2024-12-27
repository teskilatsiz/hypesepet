/*
  # Add cron extension
  
  1. Changes
    - Enable the pg_cron extension for scheduled tasks
    - Grant necessary permissions
*/

-- Enable the pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant usage to postgres
GRANT USAGE ON SCHEMA cron TO postgres;