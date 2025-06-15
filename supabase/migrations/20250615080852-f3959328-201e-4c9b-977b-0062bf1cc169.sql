
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'coach', 'client');

-- Create enum for subscription status
CREATE TYPE public.subscription_status AS ENUM ('active', 'inactive', 'trial', 'expired');

-- Create enum for pricing models
CREATE TYPE public.pricing_model AS ENUM ('one_time', 'subscription');

-- Create enum for content types
CREATE TYPE public.content_type AS ENUM ('video', 'audio', 'text', 'pdf', 'image', 'interactive');

-- Create enum for payment status
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Create profiles table with enhanced fields
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role app_role NOT NULL DEFAULT 'client',
  bio TEXT,
  specialties TEXT[],
  experience_years INTEGER,
  location TEXT,
  avatar_url TEXT,
  is_public BOOLEAN DEFAULT false,
  profile_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create coach subscriptions table (coach pays admin)
CREATE TABLE public.coach_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  tier TEXT NOT NULL DEFAULT 'basic',
  status subscription_status NOT NULL DEFAULT 'trial',
  price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  billing_cycle TEXT NOT NULL DEFAULT 'monthly',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  paychangu_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  thumbnail_url TEXT,
  pricing_model pricing_model NOT NULL DEFAULT 'one_time',
  price DECIMAL(10,2) NOT NULL,
  subscription_price DECIMAL(10,2),
  currency TEXT NOT NULL DEFAULT 'USD',
  is_published BOOLEAN DEFAULT false,
  category TEXT,
  tags TEXT[],
  estimated_duration INTEGER, -- in minutes
  difficulty_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course bundles table
CREATE TABLE public.course_bundles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  pricing_model pricing_model NOT NULL DEFAULT 'one_time',
  price DECIMAL(10,2) NOT NULL,
  subscription_price DECIMAL(10,2),
  currency TEXT NOT NULL DEFAULT 'USD',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course bundle items table (many-to-many relationship)
CREATE TABLE public.course_bundle_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bundle_id UUID NOT NULL REFERENCES public.course_bundles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(bundle_id, course_id)
);

-- Create course content table
CREATE TABLE public.course_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content_type content_type NOT NULL,
  content_url TEXT,
  content_text TEXT,
  duration INTEGER, -- in seconds for video/audio
  file_size INTEGER, -- in bytes
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enrollments table
CREATE TABLE public.enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  bundle_id UUID REFERENCES public.course_bundles(id) ON DELETE CASCADE,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  paychangu_reference TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT enrollment_type_check CHECK (
    (course_id IS NOT NULL AND bundle_id IS NULL) OR 
    (course_id IS NULL AND bundle_id IS NOT NULL)
  )
);

-- Create course progress table
CREATE TABLE public.course_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES public.course_content(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  progress_percentage INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- in seconds
  last_accessed TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(enrollment_id, content_id)
);

-- Create certificates table
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  certificate_url TEXT,
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.coach_subscriptions(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  paychangu_reference TEXT NOT NULL,
  paychangu_transaction_id TEXT,
  status payment_status NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT transaction_type_check CHECK (
    (enrollment_id IS NOT NULL AND subscription_id IS NULL) OR 
    (enrollment_id IS NULL AND subscription_id IS NOT NULL)
  )
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_bundle_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public coach profiles" ON public.profiles
  FOR SELECT USING (is_public = true AND role = 'coach');

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert user roles" ON public.user_roles
  FOR INSERT WITH CHECK (true);

-- RLS Policies for courses
CREATE POLICY "Anyone can view published courses" ON public.courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Coaches can manage their own courses" ON public.courses
  FOR ALL USING (auth.uid() = coach_id);

-- RLS Policies for course bundles
CREATE POLICY "Anyone can view published bundles" ON public.course_bundles
  FOR SELECT USING (is_published = true);

CREATE POLICY "Coaches can manage their own bundles" ON public.course_bundles
  FOR ALL USING (auth.uid() = coach_id);

-- RLS Policies for course content
CREATE POLICY "Anyone can view preview content" ON public.course_content
  FOR SELECT USING (is_preview = true);

CREATE POLICY "Coaches can manage their course content" ON public.course_content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE id = course_id AND coach_id = auth.uid()
    )
  );

CREATE POLICY "Enrolled clients can view course content" ON public.course_content
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.enrollments 
      WHERE course_id = course_content.course_id 
      AND client_id = auth.uid() 
      AND payment_status = 'completed'
    )
  );

-- RLS Policies for enrollments
CREATE POLICY "Users can view their own enrollments" ON public.enrollments
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Users can create their own enrollments" ON public.enrollments
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Coaches can view enrollments for their courses" ON public.enrollments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE id = enrollments.course_id AND coach_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.course_bundles 
      WHERE id = enrollments.bundle_id AND coach_id = auth.uid()
    )
  );

-- RLS Policies for course progress
CREATE POLICY "Users can manage their own progress" ON public.course_progress
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.enrollments 
      WHERE id = enrollment_id AND client_id = auth.uid()
    )
  );

-- RLS Policies for certificates
CREATE POLICY "Users can view their own certificates" ON public.certificates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.enrollments 
      WHERE id = enrollment_id AND client_id = auth.uid()
    )
  );

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.enrollments 
      WHERE id = enrollment_id AND client_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.coach_subscriptions 
      WHERE id = subscription_id AND coach_id = auth.uid()
    )
  );

-- RLS Policies for coach subscriptions
CREATE POLICY "Coaches can view their own subscriptions" ON public.coach_subscriptions
  FOR ALL USING (auth.uid() = coach_id);

-- Create trigger function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (user_id, email, role, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'client'),
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  
  -- Insert user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'client')
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_is_public ON public.profiles(is_public);
CREATE INDEX idx_courses_coach_id ON public.courses(coach_id);
CREATE INDEX idx_courses_is_published ON public.courses(is_published);
CREATE INDEX idx_enrollments_client_id ON public.enrollments(client_id);
CREATE INDEX idx_enrollments_course_id ON public.enrollments(course_id);
CREATE INDEX idx_enrollments_bundle_id ON public.enrollments(bundle_id);
CREATE INDEX idx_course_progress_enrollment_id ON public.course_progress(enrollment_id);
CREATE INDEX idx_transactions_paychangu_reference ON public.transactions(paychangu_reference);
