ALTER TABLE public.cart_items
    ALTER COLUMN users_id SET NOT NULL;

ALTER TABLE public.cart_items
    ALTER COLUMN created_at DROP NOT NULL;

ALTER TABLE public.cart_items
    ALTER COLUMN updated_at DROP NOT NULL;