ALTER TABLE public.tags
    ADD CONSTRAINT uc_tags_name UNIQUE (name);

ALTER TABLE public.tags
    ADD CONSTRAINT uc_tags_slug UNIQUE (slug);

ALTER TABLE public.tags
    ADD CONSTRAINT FK_TAGS_ON_TAGS FOREIGN KEY (tags_id) REFERENCES public.inventory_items (id);