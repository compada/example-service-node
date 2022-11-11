// https://github.com/graphile/graphile-engine/blob/v4/packages/postgraphile-core/__tests__/kitchen-sink-schema.sql

import { postgraphile } from "postgraphile";
import PgSimplifyInflectorPlugin from "@graphile-contrib/pg-simplify-inflector";
import ConnectionFilterPlugin from "postgraphile-plugin-connection-filter";
import FederationPlugin from "postgraphile-federation-plugin";

const appendPlugins = [
  PgSimplifyInflectorPlugin,
  ConnectionFilterPlugin,
  FederationPlugin.default
];

const pgSettings = (req) => {
  const settings = {};
  if (req.auth) {
    settings["jwt.claims.scope"] = req.auth.scope;
    settings["jwt.claims.person_id"] = req.auth.person_id;
  }
  return settings;
};

const allowExplain = (_req) => {
  return true;
};

const postgraphileOptionsDEV = {
  subscriptions: true,
  watchPg: true,
  dynamicJson: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  showErrorStack: "json",
  extendedErrors: ["hint", "detail", "errcode"],
  appendPlugins,
  exportGqlSchemaPath: "schema.graphql",
  graphiql: true,
  enhanceGraphiql: true,
  allowExplain,
  enableQueryBatching: true,
  legacyRelations: "omit",
  pgSettings
};

const postgraphileOptionsPROD = {
  subscriptions: true,
  retryOnInitFail: true,
  dynamicJson: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  extendedErrors: ["errcode"],
  appendPlugins,
  graphiql: false,
  enableQueryBatching: true,
  disableQueryLog: true, // our default logging has performance issues, but do make sure you have a logging system in place!
  legacyRelations: "omit",
  pgSettings
};

const pgPoolConfig = {};

const schemaName = "public";

// https://www.graphile.org/postgraphile/usage-library/#recommended-options
const postgraphileOptions = process.env.NODE_ENV === "production" ? postgraphileOptionsPROD : postgraphileOptionsDEV;

export const postgraphileMiddleware = postgraphile(
  pgPoolConfig,
  schemaName,
  postgraphileOptions
);
