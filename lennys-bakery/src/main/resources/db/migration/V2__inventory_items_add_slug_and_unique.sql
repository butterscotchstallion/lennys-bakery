ALTER TABLE public.inventory_items
    ADD slug VARCHAR(25);

ALTER TABLE public.inventory_items
    ADD CONSTRAINT uc_inventory_items_name UNIQUE (name);

ALTER TABLE public.inventory_items
    ADD CONSTRAINT uc_inventory_items_slug UNIQUE (slug);

ALTER TABLE public.inventory_items
    ALTER COLUMN price TYPE DECIMAL USING (price::DECIMAL);