ALTER TABLE public.inventory_items
    ADD rapid_ship_available BOOLEAN;

ALTER TABLE public.inventory_items
    ALTER COLUMN price TYPE DECIMAL USING (price::DECIMAL);

ALTER TABLE public.inventory_items
    ALTER COLUMN slug SET NOT NULL;