
-- Create a default admin user
-- First, we'll insert directly into auth.users (this is a one-time setup)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) 
SELECT 
  '00000000-0000-0000-0000-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'admin@system.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"first_name": "System", "last_name": "Admin", "role": "admin"}'::jsonb,
  false,
  'authenticated'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@system.com'
);

-- Insert the admin profile
INSERT INTO public.profiles (
  user_id,
  email,
  first_name,
  last_name,
  role,
  profile_completed
)
SELECT 
  '00000000-0000-0000-0000-000000000001'::uuid,
  'admin@system.com',
  'System',
  'Admin',
  'admin'::app_role,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE user_id = '00000000-0000-0000-0000-000000000001'::uuid
);

-- Insert the admin role
INSERT INTO public.user_roles (
  user_id,
  role
)
SELECT 
  '00000000-0000-0000-0000-000000000001'::uuid,
  'admin'::app_role
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = '00000000-0000-0000-0000-000000000001'::uuid AND role = 'admin'::app_role
);
