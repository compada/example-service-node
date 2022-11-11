\connect {{ cookiecutter.resource_plural }};

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.{{ cookiecutter.resource }} (
    id uuid DEFAULT uuid_generate_v4 (),
    -- more attributes!!
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

COMMENT ON TABLE public.{{ cookiecutter.resource }} IS
'{{ cookiecutter.description }}';
COMMENT ON COLUMN public.{{ cookiecutter.resource }}.id IS
'The primary unique UUID for the {{ cookiecutter.resource }}.';
COMMENT ON COLUMN public.{{ cookiecutter.resource }}.created_at IS
'The {{ cookiecutter.resource }}''s timestamp when created.';
