// https://github.com/graphile/graphile-engine/blob/v4/packages/postgraphile-core/__tests__/kitchen-sink-schema.sql
// https://github.com/graphile-contrib/postgraphile-plugin-connection-filter

import { postgraphile } from "postgraphile";
import PgSimplifyInflectorPlugin from "@graphile-contrib/pg-simplify-inflector";
import ConnectionFilterPlugin from "postgraphile-plugin-connection-filter";
import FederationPlugin from "postgraphile-federation-plugin";
import PgManyToManyPlugin from "@graphile-contrib/pg-many-to-many";

const appendPlugins = [
  PgSimplifyInflectorPlugin,
  ConnectionFilterPlugin,
  FederationPlugin.default,
  PgManyToManyPlugin,
];

const ROLES = [
  "postgres",
  "person",
  "visitor"
];

const pgSettings = (req) => {
  const settings = { "role": "visitor" };
  if (req.auth) {
    const roles = req.auth["https://api.compada.io/roles"] || [];
    // Intersection (ROLES ∩ roles)[0]
    settings["role"] = ROLES.find(x => roles.includes(x)) || "person";
    settings["jwt.claims.scope"] = req.auth.scope;
    settings["jwt.claims.person_id"] = req.auth.person_id;
    settings["jwt.claims.sub"] = req.auth.sub;
  }
  return settings;
};

const allowExplain = (_req) => {
  return true;
};

const graphileBuildOptions = {
  pgStrictFunctions: true,
  connectionFilterAllowedFieldTypes: ["String", "Int"],
  connectionFilterArrays: false,
  connectionFilterComputedColumns: false,
  connectionFilterSetofFunctions: false,
};

const postgraphileOptionsDEV = {
  subscriptions: true,
  watchPg: true,
  dynamicJson: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  ignoreIndexes: false,
  showErrorStack: "json",
  extendedErrors: ["hint", "detail", "errcode"],
  appendPlugins,
  exportGqlSchemaPath: "schema.graphql",
  graphiql: true,
  enhanceGraphiql: true,
  allowExplain,
  enableQueryBatching: true,
  legacyRelations: "omit",
  pgSettings,
  graphileBuildOptions,
};

const postgraphileOptionsPROD = {
  subscriptions: true,
  retryOnInitFail: true,
  dynamicJson: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  ignoreIndexes: false,
  extendedErrors: ["errcode"],
  appendPlugins,
  graphiql: false,
  enableQueryBatching: true,
  disableQueryLog: true, // our default logging has performance issues, but do make sure you have a logging system in place!
  legacyRelations: "omit",
  pgSettings,
  graphileBuildOptions,
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
