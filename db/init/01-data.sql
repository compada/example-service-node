\connect {{ cookiecutter.resourcePlural }};

INSERT INTO public.{{ cookiecutter.resource }} (id, attr1, attr2) VALUES
('d67fa44a-70c1-4d1a-89ba-973f9abdfe3f', 'foo', 'bar'),
('257bc9a6-ba9b-4608-820d-c818e4d391a7', 'baz', 'qux');
