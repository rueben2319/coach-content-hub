
-- For all relevant tables, restrict SELECT/INSERT/UPDATE/DELETE to coaches with active (not expired) subscriptions.

-- Utility security definer function to check coach subscription
CREATE OR REPLACE FUNCTION public.is_coach_subscribed(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_subscribed boolean := false;
BEGIN
  SELECT
    EXISTS (
      SELECT 1
      FROM public.coach_subscriptions
      WHERE coach_id = _user_id
        AND status = 'active'
        AND expires_at IS NOT NULL
        AND expires_at > now()
      LIMIT 1
    )
  INTO v_subscribed;
  RETURN v_subscribed;
END;
$$;

-- Example policy for courses table:
DROP POLICY IF EXISTS "Coaches can view their own courses" ON public.courses;
CREATE POLICY "Coaches can view their own courses (only if subscribed)" 
  ON public.courses 
  FOR SELECT 
  USING (
    auth.uid() = coach_id
    AND public.is_coach_subscribed(auth.uid())
  );

DROP POLICY IF EXISTS "Coaches can create their own courses" ON public.courses;
CREATE POLICY "Coaches can create their own courses (only if subscribed)" 
  ON public.courses 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = coach_id
    AND public.is_coach_subscribed(auth.uid())
  );

DROP POLICY IF EXISTS "Coaches can update their own courses" ON public.courses;
CREATE POLICY "Coaches can update their own courses (only if subscribed)" 
  ON public.courses 
  FOR UPDATE 
  USING (
    auth.uid() = coach_id
    AND public.is_coach_subscribed(auth.uid())
  );

DROP POLICY IF EXISTS "Coaches can delete their own courses" ON public.courses;
CREATE POLICY "Coaches can delete their own courses (only if subscribed)" 
  ON public.courses 
  FOR DELETE 
  USING (
    auth.uid() = coach_id
    AND public.is_coach_subscribed(auth.uid())
  );

-- Repeat equivalently for related tables:
-- course_content
DROP POLICY IF EXISTS "Coaches can manage their course content" ON public.course_content;
CREATE POLICY "Coaches can manage their course content (only if subscribed)"
  ON public.course_content
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = course_content.course_id
        AND courses.coach_id = auth.uid()
    )
    AND public.is_coach_subscribed(auth.uid())
  );

-- course_bundles
DROP POLICY IF EXISTS "Coaches can manage their bundles" ON public.course_bundles;
CREATE POLICY "Coaches can manage their bundles (only if subscribed)" 
  ON public.course_bundles 
  FOR ALL 
  USING (
    coach_id = auth.uid()
    AND public.is_coach_subscribed(auth.uid())
  );

-- course_bundle_items
DROP POLICY IF EXISTS "Coaches can manage their bundle items" ON public.course_bundle_items;
CREATE POLICY "Coaches can manage their bundle items (only if subscribed)" 
  ON public.course_bundle_items 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.course_bundles
      WHERE course_bundles.id = course_bundle_items.bundle_id
        AND course_bundles.coach_id = auth.uid()
    )
    AND public.is_coach_subscribed(auth.uid())
  );

-- Only allow access for *clients* if their enrollment is valid, but do not restrict on subscription
-- Enrollments and course_progress (coach-side) will only work if the coach meets subscription requirement
-- Only update policies for coach-side access as above.

-- The dashboard itself should use public information or allow SELECT as needed.
