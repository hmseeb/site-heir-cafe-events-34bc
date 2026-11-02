ALTER TABLE public.leads DROP CONSTRAINT leads_kind_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_kind_check CHECK (kind IN ('inquiry','newsletter','tour'));