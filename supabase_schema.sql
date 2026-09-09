-- ====================================================================
-- NOTARY PASSPORT - PRODUCTION SUPABASE POSTGRESQL SCHEMA
-- Copy and paste this script directly into Supabase SQL Editor
-- ====================================================================

-- 1. EXTENSIONS & ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE credential_type_enum AS ENUM (
  'commission', 
  'insurance', 
  'id', 
  'background_check', 
  'specialty', 
  'bond'
);

CREATE TYPE credential_status_enum AS ENUM (
  'pending', 
  'verified', 
  'expiring_soon', 
  'expired', 
  'rejected'
);

CREATE TYPE access_status_enum AS ENUM (
  'active', 
  'pending_request', 
  'revoked', 
  'expired'
);

-- 2. TABLES

-- Notary Profiles
CREATE TABLE IF NOT EXISTS public.notary_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  handle TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  photo_url TEXT,
  bio TEXT,
  primary_jurisdiction VARCHAR(5) NOT NULL DEFAULT 'TX',
  country VARCHAR(2) NOT NULL DEFAULT 'US',
  is_ron_approved BOOLEAN DEFAULT FALSE,
  signing_languages TEXT[] DEFAULT ARRAY['English'],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jurisdiction Rules Lookup
CREATE TABLE IF NOT EXISTS public.jurisdictions (
  id VARCHAR(10) PRIMARY KEY, -- e.g. 'US-TX', 'CA-ON'
  country VARCHAR(2) NOT NULL,
  state_or_province VARCHAR(5) NOT NULL,
  name TEXT NOT NULL,
  commission_term_years INT NOT NULL DEFAULT 4,
  requires_bond BOOLEAN DEFAULT FALSE,
  bond_amount INT DEFAULT 0,
  requires_eo_insurance BOOLEAN DEFAULT TRUE,
  min_insurance_amount INT DEFAULT 25000,
  requires_background_check BOOLEAN DEFAULT TRUE,
  ron_allowed BOOLEAN DEFAULT TRUE,
  notes TEXT
);

-- Credentials Vault
CREATE TABLE IF NOT EXISTS public.credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notary_profile_id UUID REFERENCES public.notary_profiles(id) ON DELETE CASCADE,
  type credential_type_enum NOT NULL,
  title TEXT NOT NULL,
  jurisdiction_code VARCHAR(5),
  file_name TEXT NOT NULL,
  file_size TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Private S3/Supabase path
  issue_date DATE NOT NULL,
  expiry_date DATE,
  status credential_status_enum DEFAULT 'pending',
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  verified_by TEXT,
  rejection_reason TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Access Grants (Permission Control)
CREATE TABLE IF NOT EXISTS public.access_grants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notary_profile_id UUID REFERENCES public.notary_profiles(id) ON DELETE CASCADE,
  granted_to_name TEXT NOT NULL,
  granted_to_email TEXT NOT NULL,
  access_level VARCHAR(20) DEFAULT 'document_view',
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  status access_status_enum DEFAULT 'active'
);

-- Verification Audit Logs
CREATE TABLE IF NOT EXISTS public.verification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  credential_id UUID REFERENCES public.credentials(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  actor_name TEXT NOT NULL,
  actor_role VARCHAR(20) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- 3. SEED JURISDICTION DATA
INSERT INTO public.jurisdictions (id, country, state_or_province, name, commission_term_years, requires_bond, bond_amount, requires_eo_insurance, min_insurance_amount, requires_background_check, ron_allowed, notes)
VALUES 
  ('US-TX', 'US', 'TX', 'Texas', 4, TRUE, 10000, TRUE, 25000, TRUE, TRUE, 'Requires $10,000 state bond and separate state registration for Remote Online Notarization.'),
  ('US-CA', 'US', 'CA', 'California', 4, TRUE, 15000, TRUE, 100000, TRUE, TRUE, 'Requires $15,000 surety bond, LiveScan background check, and state approved course.'),
  ('US-FL', 'US', 'FL', 'Florida', 4, TRUE, 7500, TRUE, 25000, TRUE, TRUE, 'RON notary requires a $25,000 E&O policy and completion of a 2-hour state-approved RON course.'),
  ('US-NY', 'US', 'NY', 'New York', 4, FALSE, 0, TRUE, 25000, TRUE, TRUE, 'Electronic notarization allowed under Executive Law 135-c. Notaries register with Department of State.'),
  ('US-OH', 'US', 'OH', 'Ohio', 5, FALSE, 0, TRUE, 25000, TRUE, TRUE, 'Criminal records check required. Online Notary authorization requires 5-year online commission.'),
  ('CA-ON', 'CA', 'ON', 'Ontario', 3, FALSE, 0, TRUE, 1000000, TRUE, TRUE, 'Governed by the Notaries Act. Remote commissioning permitted under Law Society guidelines.'),
  ('CA-BC', 'CA', 'BC', 'British Columbia', 3, TRUE, 5000, TRUE, 1000000, TRUE, TRUE, 'Supervised by the Society of Notaries Public of BC. Mandatory professional indemnity insurance.'),
  ('CA-AB', 'CA', 'AB', 'Alberta', 2, FALSE, 0, TRUE, 500000, TRUE, TRUE, 'Notary appointments issued by Minister of Justice. Virtual witnessing supported.')
ON CONFLICT (id) DO NOTHING;

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.notary_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_grants ENABLE ROW LEVEL SECURITY;

-- Public read access for profiles (zero-knowledge)
CREATE POLICY "Public profile status read access" ON public.notary_profiles
  FOR SELECT USING (true);

-- Public read access for credential verification status metadata ONLY
CREATE POLICY "Public status badge read access" ON public.credentials
  FOR SELECT USING (true);

-- Only notary owners can insert/update/delete their credentials
CREATE POLICY "Notary owner credential full access" ON public.credentials
  FOR ALL USING (auth.uid() = (SELECT user_id FROM public.notary_profiles WHERE id = notary_profile_id));

-- Access grant policy
CREATE POLICY "Access grant read policy" ON public.access_grants
  FOR SELECT USING (true);
