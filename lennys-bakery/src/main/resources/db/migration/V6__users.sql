ALTER TABLE public.users
    ADD CONSTRAINT uc_users_username UNIQUE (username);