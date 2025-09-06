-- Database initialization script for PumpItBetter SPA
-- This script runs when the PostgreSQL container starts for the first time

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create additional database for testing if needed
-- CREATE DATABASE pibspa_test OWNER pibspa;

-- Set timezone
SET timezone = 'UTC';