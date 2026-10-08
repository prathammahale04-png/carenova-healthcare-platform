-- =========================================================================
-- CareNova Healthcare Platform - Complete Supabase Backend Architecture
-- Migration: 001_carenova_backend.sql
-- 
-- Includes:
-- 1. Table Definitions (doctors, services, appointments, contact_messages, profiles)
-- 2. Constraints & Performance Indexes
-- 3. Security Definer Helper Function (public.is_admin)
-- 4. Automatic Profile Creation Trigger on auth.users insert
-- 5. Row Level Security (RLS) & Granular Access Control Policies
-- =========================================================================

-- Enable pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- 1. DOCTORS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialty text NOT NULL,
  experience_years integer,
  rating numeric(2,1),
  image_url text,
  bio text,
  languages text[],
  created_at timestamptz NOT NULL DEFAULT now()
);

-- =========================================================================
-- 2. SERVICES TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- =========================================================================
-- 3. APPOINTMENTS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  email text NOT NULL,
  phone text,
  doctor_id uuid REFERENCES public.doctors(id) ON DELETE SET NULL,
  specialty text,
  appointment_date date,
  appointment_time text,
  consultation_type text,
  reason text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT appointments_status_check CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'))
);

-- =========================================================================
-- 4. CONTACT MESSAGES TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'unread',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Ensure status column exists if table was previously created without it
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'unread';

-- =========================================================================
-- 5. PROFILES TABLE (USER / ADMIN AUTHORIZATION)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin'))
);

-- =========================================================================
-- 6. INDEXES FOR QUERY OPTIMIZATION
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON public.doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_doctors_name ON public.doctors(name);

CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON public.appointments(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- =========================================================================
-- 7. HELPER FUNCTION: public.is_admin()
-- Evaluates whether the currently authenticated user possesses role = 'admin'
-- Marked SECURITY DEFINER so that it can safely inspect public.profiles without RLS recursion.
-- =========================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

-- Revoke public execution and grant to authenticated and anon roles safely
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- =========================================================================
-- 8. AUTOMATIC PROFILE CREATION TRIGGER
-- Whenever a user signs up or is created via auth.users, create a public.profiles
-- row with the default 'user' role. Admins must be explicitly promoted via SQL.
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================================
-- 9. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- =========================================================================
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- 10. RLS POLICIES
-- =========================================================================

-- -------------------------------------------------------------------------
-- DOCTORS POLICIES
-- Anonymous & authenticated users: SELECT allowed
-- Admin: SELECT, INSERT, UPDATE, DELETE
-- -------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public select doctors" ON public.doctors;
DROP POLICY IF EXISTS "Allow public read doctors" ON public.doctors;
CREATE POLICY "Allow public read doctors"
  ON public.doctors
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow admin manage doctors" ON public.doctors;
CREATE POLICY "Allow admin manage doctors"
  ON public.doctors
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- -------------------------------------------------------------------------
-- SERVICES POLICIES
-- Anonymous & authenticated users: SELECT allowed
-- Admin: SELECT, INSERT, UPDATE, DELETE
-- -------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public select services" ON public.services;
DROP POLICY IF EXISTS "Allow public read services" ON public.services;
CREATE POLICY "Allow public read services"
  ON public.services
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow admin manage services" ON public.services;
CREATE POLICY "Allow admin manage services"
  ON public.services
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- -------------------------------------------------------------------------
-- APPOINTMENTS POLICIES
-- Public (anonymous & authenticated): INSERT allowed only (no reading sensitive records)
-- Admin: Full management (SELECT, UPDATE, DELETE)
-- -------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public insert appointments" ON public.appointments;
CREATE POLICY "Allow public insert appointments"
  ON public.appointments
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin manage appointments" ON public.appointments;
CREATE POLICY "Allow admin manage appointments"
  ON public.appointments
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- -------------------------------------------------------------------------
-- CONTACT MESSAGES POLICIES
-- Public (anonymous & authenticated): INSERT allowed only
-- Admin: Full management (SELECT, UPDATE, DELETE)
-- -------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public insert contact messages" ON public.contact_messages;
CREATE POLICY "Allow public insert contact messages"
  ON public.contact_messages
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin manage contact messages" ON public.contact_messages;
CREATE POLICY "Allow admin manage contact messages"
  ON public.contact_messages
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- -------------------------------------------------------------------------
-- PROFILES POLICIES
-- Authenticated users: view own profile
-- Admin: Full management of profiles
-- -------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can manage profiles" ON public.profiles;
CREATE POLICY "Admins can manage profiles"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
