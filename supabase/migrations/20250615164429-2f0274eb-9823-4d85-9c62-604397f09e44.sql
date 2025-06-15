
-- Add detailed progress tracking
CREATE TABLE public.user_learning_paths (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  estimated_completion_date TIMESTAMP WITH TIME ZONE,
  actual_completion_date TIMESTAMP WITH TIME ZONE,
  learning_pace TEXT DEFAULT 'normal' CHECK (learning_pace IN ('slow', 'normal', 'fast')),
  goals JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add learning milestones
CREATE TABLE public.learning_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  learning_path_id UUID NOT NULL,
  milestone_type TEXT NOT NULL CHECK (milestone_type IN ('course_start', 'chapter_complete', 'quiz_passed', 'assignment_submitted', 'course_complete')),
  content_id UUID,
  chapter_id UUID,
  achieved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  score INTEGER,
  time_spent INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Add quiz and assessment results
CREATE TABLE public.assessment_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content_id UUID NOT NULL,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('quiz', 'assignment', 'final_exam')),
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  attempts INTEGER DEFAULT 1,
  time_spent INTEGER DEFAULT 0,
  answers JSONB DEFAULT '[]'::jsonb,
  feedback TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add learning streaks and habits
CREATE TABLE public.learning_streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  streak_type TEXT NOT NULL CHECK (streak_type IN ('daily', 'weekly', 'monthly')),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE NOT NULL,
  total_activities INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, streak_type)
);

-- Add study sessions tracking
CREATE TABLE public.study_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID,
  content_id UUID,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration INTEGER DEFAULT 0,
  activities JSONB DEFAULT '[]'::jsonb,
  focus_score INTEGER, -- 1-100 based on engagement
  break_count INTEGER DEFAULT 0,
  session_quality TEXT CHECK (session_quality IN ('poor', 'fair', 'good', 'excellent'))
);

-- Add coaching insights and recommendations
CREATE TABLE public.coaching_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL,
  client_id UUID NOT NULL,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('progress_report', 'recommendation', 'concern', 'achievement')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  action_items JSONB DEFAULT '[]'::jsonb,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Add learning analytics aggregations
CREATE TABLE public.learning_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_study_time INTEGER DEFAULT 0,
  courses_started INTEGER DEFAULT 0,
  courses_completed INTEGER DEFAULT 0,
  content_consumed INTEGER DEFAULT 0,
  average_session_duration INTEGER DEFAULT 0,
  engagement_score INTEGER DEFAULT 0,
  skills_gained JSONB DEFAULT '[]'::jsonb,
  weak_areas JSONB DEFAULT '[]'::jsonb,
  strong_areas JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, period_start, period_end)
);

-- Enhance existing course_progress table
ALTER TABLE public.course_progress 
ADD COLUMN session_id UUID,
ADD COLUMN learning_path_id UUID,
ADD COLUMN notes TEXT,
ADD COLUMN difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 5),
ADD COLUMN satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5);

-- Enable RLS on all new tables
ALTER TABLE public.user_learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_analytics ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_learning_paths
CREATE POLICY "Users can manage their own learning paths" ON public.user_learning_paths
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Coaches can view client learning paths" ON public.user_learning_paths
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      JOIN public.courses c ON e.course_id = c.id
      WHERE e.client_id = user_id AND c.coach_id = auth.uid()
    )
  );

-- RLS policies for learning_milestones
CREATE POLICY "Users can view their milestones" ON public.learning_milestones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_learning_paths ulp
      WHERE ulp.id = learning_path_id AND ulp.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert milestones" ON public.learning_milestones
  FOR INSERT WITH CHECK (true);

-- RLS policies for assessment_results
CREATE POLICY "Users can manage their assessment results" ON public.assessment_results
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Coaches can view client assessment results" ON public.assessment_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.course_content cc
      JOIN public.courses c ON cc.course_id = c.id
      WHERE cc.id = content_id AND c.coach_id = auth.uid()
    )
  );

-- RLS policies for learning_streaks
CREATE POLICY "Users can manage their learning streaks" ON public.learning_streaks
  FOR ALL USING (user_id = auth.uid());

-- RLS policies for study_sessions
CREATE POLICY "Users can manage their study sessions" ON public.study_sessions
  FOR ALL USING (user_id = auth.uid());

-- RLS policies for coaching_insights
CREATE POLICY "Coaches and clients can view relevant insights" ON public.coaching_insights
  FOR SELECT USING (coach_id = auth.uid() OR client_id = auth.uid());

CREATE POLICY "Coaches can create insights" ON public.coaching_insights
  FOR INSERT WITH CHECK (coach_id = auth.uid());

CREATE POLICY "Coaches can update their insights" ON public.coaching_insights
  FOR UPDATE USING (coach_id = auth.uid());

-- RLS policies for learning_analytics
CREATE POLICY "Users can view their analytics" ON public.learning_analytics
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage analytics" ON public.learning_analytics
  FOR ALL USING (true);

-- Create indexes for performance
CREATE INDEX idx_user_learning_paths_user_id ON public.user_learning_paths(user_id);
CREATE INDEX idx_user_learning_paths_course_id ON public.user_learning_paths(course_id);
CREATE INDEX idx_learning_milestones_learning_path_id ON public.learning_milestones(learning_path_id);
CREATE INDEX idx_assessment_results_user_id ON public.assessment_results(user_id);
CREATE INDEX idx_assessment_results_content_id ON public.assessment_results(content_id);
CREATE INDEX idx_learning_streaks_user_id ON public.learning_streaks(user_id);
CREATE INDEX idx_study_sessions_user_id ON public.study_sessions(user_id);
CREATE INDEX idx_coaching_insights_coach_id ON public.coaching_insights(coach_id);
CREATE INDEX idx_coaching_insights_client_id ON public.coaching_insights(client_id);
CREATE INDEX idx_learning_analytics_user_id ON public.learning_analytics(user_id);

-- Function to update learning streaks
CREATE OR REPLACE FUNCTION public.update_learning_streak(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_last_activity_date date;
  v_current_date date := current_date;
  v_streak_record record;
BEGIN
  -- Update daily streak
  SELECT * INTO v_streak_record
  FROM public.learning_streaks
  WHERE user_id = _user_id AND streak_type = 'daily';
  
  IF v_streak_record IS NULL THEN
    -- Create new streak record
    INSERT INTO public.learning_streaks (user_id, streak_type, current_streak, longest_streak, last_activity_date, total_activities)
    VALUES (_user_id, 'daily', 1, 1, v_current_date, 1);
  ELSE
    v_last_activity_date := v_streak_record.last_activity_date;
    
    IF v_last_activity_date = v_current_date THEN
      -- Already logged today, just increment activities
      UPDATE public.learning_streaks
      SET total_activities = total_activities + 1,
          updated_at = now()
      WHERE id = v_streak_record.id;
    ELSIF v_last_activity_date = v_current_date - interval '1 day' THEN
      -- Consecutive day, increment streak
      UPDATE public.learning_streaks
      SET current_streak = current_streak + 1,
          longest_streak = GREATEST(longest_streak, current_streak + 1),
          last_activity_date = v_current_date,
          total_activities = total_activities + 1,
          updated_at = now()
      WHERE id = v_streak_record.id;
    ELSE
      -- Streak broken, reset
      UPDATE public.learning_streaks
      SET current_streak = 1,
          last_activity_date = v_current_date,
          total_activities = total_activities + 1,
          updated_at = now()
      WHERE id = v_streak_record.id;
    END IF;
  END IF;
END;
$$;

-- Function to calculate learning analytics
CREATE OR REPLACE FUNCTION public.calculate_learning_analytics(_user_id uuid, _start_date date, _end_date date)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_study_time integer := 0;
  v_courses_started integer := 0;
  v_courses_completed integer := 0;
  v_content_consumed integer := 0;
  v_avg_session_duration integer := 0;
  v_engagement_score integer := 0;
BEGIN
  -- Calculate metrics
  SELECT COALESCE(SUM(duration), 0) INTO v_total_study_time
  FROM public.study_sessions
  WHERE user_id = _user_id 
    AND started_at::date BETWEEN _start_date AND _end_date;
  
  SELECT COUNT(*) INTO v_courses_started
  FROM public.user_learning_paths
  WHERE user_id = _user_id 
    AND started_at::date BETWEEN _start_date AND _end_date;
  
  SELECT COUNT(*) INTO v_courses_completed
  FROM public.user_learning_paths
  WHERE user_id = _user_id 
    AND actual_completion_date::date BETWEEN _start_date AND _end_date;
  
  SELECT COUNT(*) INTO v_content_consumed
  FROM public.course_progress
  WHERE enrollment_id IN (
    SELECT id FROM public.enrollments WHERE client_id = _user_id
  ) AND completed = true
    AND completed_at::date BETWEEN _start_date AND _end_date;
  
  SELECT COALESCE(AVG(duration), 0) INTO v_avg_session_duration
  FROM public.study_sessions
  WHERE user_id = _user_id 
    AND started_at::date BETWEEN _start_date AND _end_date;
  
  -- Simple engagement score based on activity
  v_engagement_score := LEAST(100, (v_content_consumed * 10) + (v_courses_completed * 20));
  
  -- Insert or update analytics
  INSERT INTO public.learning_analytics (
    user_id, period_start, period_end, total_study_time,
    courses_started, courses_completed, content_consumed,
    average_session_duration, engagement_score
  ) VALUES (
    _user_id, _start_date, _end_date, v_total_study_time,
    v_courses_started, v_courses_completed, v_content_consumed,
    v_avg_session_duration, v_engagement_score
  )
  ON CONFLICT (user_id, period_start, period_end)
  DO UPDATE SET
    total_study_time = EXCLUDED.total_study_time,
    courses_started = EXCLUDED.courses_started,
    courses_completed = EXCLUDED.courses_completed,
    content_consumed = EXCLUDED.content_consumed,
    average_session_duration = EXCLUDED.average_session_duration,
    engagement_score = EXCLUDED.engagement_score,
    created_at = now();
END;
$$;

-- Trigger to update streaks on study session
CREATE OR REPLACE FUNCTION public.handle_study_session_streak()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.ended_at IS NOT NULL AND OLD.ended_at IS NULL) THEN
    PERFORM public.update_learning_streak(NEW.user_id);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_learning_streak
  AFTER INSERT OR UPDATE ON public.study_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_study_session_streak();
