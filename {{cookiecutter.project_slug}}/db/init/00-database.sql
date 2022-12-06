\connect {{ cookiecutter.resource_plural }};

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.{{ cookiecutter.resource }} (
    id uuid DEFAULT uuid_generate_v4 (),
    -- more attributes!!
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
