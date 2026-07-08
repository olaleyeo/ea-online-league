-- Enable Row Level Security (RLS) on all public tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tournament" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Player" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Fixture" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Standing" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "KnockoutTie" ENABLE ROW LEVEL SECURITY;

-- Note: We are not adding any policies that allow public access.
-- This means that all external access via the Supabase Data API (PostgREST) will be completely blocked.
-- Our backend uses Prisma which connects as the 'postgres' role and automatically bypasses RLS,
-- so our backend API will continue to function perfectly while securing the database against external tampering.
