ALTER TABLE public.cart_items
    ADD users_id INTEGER;

ALTER TABLE public.cart_items
    ALTER COLUMN users_id SET NOT NULL;

ALTER TABLE public.cart_items
    ADD CONSTRAINT uc_cart_items_inventory_item UNIQUE (inventory_item_id);

ALTER TABLE public.cart_items
    ADD CONSTRAINT uc_cart_items_users UNIQUE (users_id);

ALTER TABLE public.cart_items
    ADD CONSTRAINT FK_CART_ITEMS_ON_INVENTORY_ITEM FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_items (id);

ALTER TABLE public.cart_items
    ADD CONSTRAINT FK_CART_ITEMS_ON_USERS FOREIGN KEY (users_id) REFERENCES public.users (id);