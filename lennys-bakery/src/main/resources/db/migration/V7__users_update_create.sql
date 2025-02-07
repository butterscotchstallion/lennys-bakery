ALTER TABLE public.users
    ALTER COLUMN created_at DROP NOT NULL;

ALTER TABLE public.users
    ALTER COLUMN created_at SET DEFAULT NOW();

ALTER TABLE public.users
    ALTER COLUMN updated_at DROP NOT NULL;

ALTER TABLE public.users
    ALTER COLUMN updated_at SET DEFAULT NOW();