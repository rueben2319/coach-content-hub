
-- Create or update the trigger function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_role_text text;
  user_role_enum public.app_role;
BEGIN
  -- Get role as text first, default to 'client'
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

-- Drop existing trigger if it exists and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
