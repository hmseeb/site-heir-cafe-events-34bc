CREATE TABLE public.leads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('inquiry','newsletter')),
  name text,
  email text,
  phone text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  notes text,
  ghl_contact_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE INDEX leads_created_at_idx ON public.leads (created_at DESC);