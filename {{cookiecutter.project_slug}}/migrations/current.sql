-- Enter migration here

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

CREATE OR REPLACE FUNCTION current_user_id() RETURNS uuid AS $$
  SELECT nullif(current_setting('jwt.claims.person_id', true), '')::uuid;
$$ language sql stable;

-- Keep if the resource is to be managed by a person
DROP POLICY IF EXISTS user_sel_policy on public.{{ cookiecutter.resource }};
CREATE POLICY user_sel_policy ON public.{{ cookiecutter.resource }}
  FOR SELECT
  USING (true);
DROP POLICY IF EXISTS user_mod_policy on public.{{ cookiecutter.resource }};
CREATE POLICY user_mod_policy ON public.{{ cookiecutter.resource }}
  USING ("person_id" = current_user_id());
