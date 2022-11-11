# Compada {{ cookiecutter.resource | capitalize }} Service

Federated graphQL sub-graph concerning {{ cookiecutter.resource_plural }}, along with the various information intrinsically related to them.

## Getting Started

This service makes heavy use of docker and docker compose. Setting up docker is beyond the scope of this readme.

```shell
cp .env.sample .env
docker compose up -d
```

## Usage

```graphql
query fetchResources {
  {{ cookiecutter.resource_plural }} {
    nodes {
      id
    }
  }
}
```

## Contributing

Submit PRs...

## Deployment

This should be done for you via CI/CD. See <https://github.com/compada/cd>.

## Reading

Learn about the various tech powering this application:

- [GraphQL](https://graphql.org)
- [GraphQL Federation](https://www.apollographql.com/docs/federation)
- [Docker](https://docs.docker.com/compose/gettingstarted)
