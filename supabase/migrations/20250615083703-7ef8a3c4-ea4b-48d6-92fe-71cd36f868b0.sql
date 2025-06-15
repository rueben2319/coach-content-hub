
-- First, let's check if the enum exists and create it if not
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'coach', 'client');
    END IF;
END $$;

-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a simplified trigger function that doesn't rely on casting
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_role_text text;
  user_role_enum public.app_role;
BEGIN
  -- Get role as text first
  user_role_text := COALESCE(NEW.raw_user_meta_data ->> 'role', 'client');
  
  -- Convert to enum safely
  CASE user_role_text
    WHEN 'admin' THEN user_role_enum := 'admin'::public.app_role;
    WHEN 'coach' THEN user_role_enum := 'coach'::public.app_role;
    ELSE user_role_enum := 'client'::public.app_role;
  END CASE;
  
  -- Insert profile
  INSERT INTO public.profiles (user_id, email, role, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    user_role_enum,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  
  -- Insert user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    user_role_enum
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log the error but don't block user creation
  RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
