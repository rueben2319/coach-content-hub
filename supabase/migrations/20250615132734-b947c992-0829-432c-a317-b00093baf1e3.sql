
-- (A) Add fields for retries and invoice/receipt status in billing_history if not already present
ALTER TABLE public.billing_history
ADD COLUMN IF NOT EXISTS retry_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_retry_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS invoice_sent boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS receipt_sent boolean DEFAULT false;

-- (B) Add admin_id and coach_id for explicit payment direction (if needed; coach_id may already exist on subscriptions)
ALTER TABLE public.billing_history
ADD COLUMN IF NOT EXISTS coach_id uuid,
ADD COLUMN IF NOT EXISTS admin_id uuid;

-- (C) Update RLS to allow only the involved coach or admin to see the billing (optional, if required)
DROP POLICY IF EXISTS "Coaches can view their billing history" ON public.billing_history;
CREATE POLICY "Involved parties can view their billing" 
  ON public.billing_history 
  FOR SELECT 
  USING (
    (coach_id = auth.uid())
    OR (
      EXISTS (
        SELECT 1 FROM public.coach_subscriptions cs
        WHERE cs.id = billing_history.subscription_id
        AND cs.coach_id = auth.uid()
      )
    )
    -- Optionally, add check for admin_id = auth.uid() if you want admin-side access
  );

-- Note: Make sure foreign key relationships (coach_id, admin_id) conform to your user management schema.
