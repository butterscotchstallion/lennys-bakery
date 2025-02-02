CREATE SEQUENCE IF NOT EXISTS public.inventory_item_id_seq START WITH 1 INCREMENT BY 50;

CREATE TABLE public.inventory_item
(
    id                INTEGER GENERATED BY DEFAULT AS IDENTITY  NOT NULL,
    name              VARCHAR(200)                              NOT NULL,
    short_description VARCHAR(200)                              NOT NULL,
    description       VARCHAR(1000)                             NOT NULL,
    price             DECIMAL                                   NOT NULL,
    created_at        TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at        TIMESTAMP WITHOUT TIME ZONE,
    image_filename    VARCHAR(255),
    CONSTRAINT pk_inventory_item PRIMARY KEY (id)
);