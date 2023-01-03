# Compada {{ cookiecutter.resource | capitalize }} Service

Federated graphQL sub-graph concerning `{{ cookiecutter.resource_plural }}`, along with the various information intrinsically related to them.

## Getting Started

### Setup

This service makes heavy use of docker and docker compose. Setting up docker is beyond the scope of this readme.

```shell
cp .env.sample .env
docker compose up -d
```

### GitHub files

GitHub's standard files (`CODEOWNERS`, `ISSUE_TEMPLATE`, etc) are managed within [.github](https://github.com/compada/.github). If this repo is to be open sourced to the public, you'll need to add a `LICENSE` [file manually](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-a-license-to-a-repository).

[GitHub Action templates](https://github.com/compada/.github/actions/new) are managed within [compada](https://github.com/compada/compada).

## Usage

### API calls via graphQL

Get a feel for our API via [graphiQL](https://graphiql.compada.dev). Use the built in tooling from postgraphile via <http://localhost:8080/graphiql>.

```graphql
query fetchResources {
  {{ cookiecutter.resource_plural }} {
    nodes {
      id
    }
  }
}
```

### Authorization

Authorization is managed via JWTs from [Auth0](https://manage.auth0.com/dashboard/us/compada/). If you need interact with the User resource, see `src/apis/auth0.js`.

### Database

```sh
gcloud sql connect {{ cookiecutter.resource }}-service-db --user=postgres
```

```sql
\connect {{ cookiecutter.resource_plural }}
SELECT * FROM pg_policies;
SELECT * FROM pg_roles;

SELECT COUNT(*) FROM public.{{ cookiecutter.resource }};
SELECT * FROM public.{{ cookiecutter.resource }} LIMIT 1;

SET jwt.claims.person_id to [YOUR_PERSON_UUID];
SELECT current_person_id();
```

### Migrations

Modify `migrations/current.sql`, per <https://github.com/graphile/migrate#usage>.

When you're ready to lock in the changes, run:

```sh
dr npx graphile-migrate commit
```

To run migrations in production, run the Kubernetes Job:

```sh
kubectl apply -k deploy/overlays/develop/migrations
```

## Contributing

The graph is powered by [Postgraphile](https://www.graphile.org/postgraphile/introduction). CRUD operations will be handled by simply adding migrations to the database. If there's some bit of custom logic that can't be written within postgres functions, you can [extend the schema manually](https://www.graphile.org/postgraphile/make-extend-schema-plugin/).

## Deployment

This should be done for you via CI/CD.

- [CI](./.github/workflows)
  - YOU NEED TO SET THIS UP [MANUALLY](https://github.com/compada/.github/actions/new). SEE [PERSON-SERVICE](https://github.com/compada/person-service) FOR INSPIRATION.
  - We _could_ handle this with cookiecutter, but we'd have to set up a token with workflow permissions each time... Plus spending some time looking at our CI Actions is probably a Good Thing™.
- [CD](https://github.com/compada/cd)

## Reading

Learn about the various tech powering this application:

- [GraphQL](https://graphql.org)
- [GraphQL Federation](https://www.apollographql.com/docs/federation)
- [Postgraphile](https://www.graphile.org/postgraphile/introduction)
- [Docker](https://docs.docker.com/compose/gettingstarted)
