-- Fix the remaining RLS issue for modules table

-- Create RLS policies for modules to fix security warning
CREATE POLICY "Coaches can manage their course modules (only if subscribed)" ON modules
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM courses 
    WHERE courses.id = modules.course_id 
    AND courses.coach_id = auth.uid()
  ) AND is_coach_subscribed(auth.uid())
);

CREATE POLICY "Enrolled clients can view published modules" ON modules
FOR SELECT USING (
  is_published = true AND
  EXISTS (
    SELECT 1 FROM enrollments 
    WHERE enrollments.course_id = modules.course_id 
    AND enrollments.client_id = auth.uid() 
    AND enrollments.payment_status = 'completed'
  )
);