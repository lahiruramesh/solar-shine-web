
-- Phase 1: Database Security (Roles & RLS) - Final Corrected Version

-- Step 1: Create user roles and profiles system (This part is idempotent and safe to re-run)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'user');
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role public.app_role NOT NULL DEFAULT 'user'
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'user');
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  is_admin_user BOOLEAN;
BEGIN
  SELECT p.role = 'admin'
  INTO is_admin_user
  FROM public.profiles p
  WHERE p.id = auth.uid();
  RETURN COALESCE(is_admin_user, FALSE);
END;
$$;

-- Step 2: Clean up existing policies and enable RLS
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.' || quote_ident(r.tablename);
    END LOOP;
END;
$$;

ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.available_time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialized_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create new, explicit policies for each action

-- Policies for tables with PUBLIC READ and ADMIN WRITE access
DO $$
DECLARE
  table_name TEXT;
  tables_list TEXT[] := ARRAY[
    'about_content', 'blog_posts', 'company_info', 'footer_links', 'hero_sections',
    'navigation_items', 'projects', 'service_cards', 'social_links', 'specialized_areas', 'testimonials'
  ];
BEGIN
  FOREACH table_name IN ARRAY tables_list
  LOOP
    EXECUTE format('CREATE POLICY "Public can read" ON public.%I FOR SELECT USING (true);', table_name);
    EXECUTE format('CREATE POLICY "Admins can insert" ON public.%I FOR INSERT WITH CHECK (public.is_admin());', table_name);
    EXECUTE format('CREATE POLICY "Admins can update" ON public.%I FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());', table_name);
    EXECUTE format('CREATE POLICY "Admins can delete" ON public.%I FOR DELETE USING (public.is_admin());', table_name);
  END LOOP;
END;
$$;

-- Policies for ADMIN-ONLY tables
DO $$
DECLARE
  table_name TEXT;
  tables_list TEXT[] := ARRAY['seo_settings', 'global_settings'];
BEGIN
  FOREACH table_name IN ARRAY tables_list
  LOOP
    EXECUTE format('CREATE POLICY "Admins can manage" ON public.%I FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());', table_name);
  END LOOP;
END;
$$;

-- Policies for 'appointments' table
CREATE POLICY "Public can create appointments" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can select appointments" ON public.appointments FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update appointments" ON public.appointments FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete appointments" ON public.appointments FOR DELETE USING (public.is_admin());

-- Policies for 'available_time_slots' table
CREATE POLICY "Public can read time slots" ON public.available_time_slots FOR SELECT USING (true);
CREATE POLICY "Admins can insert time slots" ON public.available_time_slots FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update time slots" ON public.available_time_slots FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete time slots" ON public.available_time_slots FOR DELETE USING (public.is_admin());

-- Policies for 'profiles' table
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete profiles" ON public.profiles FOR DELETE USING (public.is_admin());

