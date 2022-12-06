-- Enter migration here

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.{{ cookiecutter.resource }} (
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

CREATE OR REPLACE FUNCTION current_user_id() RETURNS uuid AS $$
  SELECT nullif(current_setting('jwt.claims.person_id', true), '')::uuid;
$$ language sql stable;

ALTER TABLE public.{{ cookiecutter.resource }} ENABLE ROW LEVEL SECURITY;

DO
$$BEGIN
  CREATE ROLE visitor;
  GRANT visitor to postgres;
  GRANT SELECT ON ALL TABLES IN SCHEMA public TO visitor;
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'Role visitor already exists. Ignoring...';
END$$;

DO
$$BEGIN
  CREATE ROLE person;
  GRANT person to postgres;
  GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO person;
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'Role person already exists. Ignoring...';
END$$;

-- Keep if the resource is to be managed by a person
DROP POLICY IF EXISTS user_sel_policy on public.{{ cookiecutter.resource }};
CREATE POLICY user_sel_policy ON public.{{ cookiecutter.resource }}
  FOR SELECT
  USING (true);
DROP POLICY IF EXISTS user_mod_policy on public.{{ cookiecutter.resource }};
CREATE POLICY user_mod_policy ON public.{{ cookiecutter.resource }}
  USING ("person_id" = current_user_id());
