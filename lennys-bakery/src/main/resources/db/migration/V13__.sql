ALTER TABLE public.tags
    ALTER COLUMN created_at DROP NOT NULL;

ALTER TABLE public.tags
    ALTER COLUMN created_at SET DEFAULT NOW();