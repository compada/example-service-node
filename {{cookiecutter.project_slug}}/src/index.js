import "./utils/otel.js";

import http from "http";
import express from "express";
import cors from "cors";
import { postgraphileMiddleware } from "./utils/index.js";
import { checkJwt } from "./utils/index.js";

const app = express();
const httpServer = http.createServer(app);

app.use(cors());

app.use(postgraphileMiddleware.graphqlRoute, checkJwt);
app.use(postgraphileMiddleware);

app.get("/healthz", (_, res) => {
  const data = {
    uptime: process.uptime(),
    message: "Ok",
    date: new Date()
  };

  res.status(200).send(data);
});

await new Promise((resolve) => httpServer.listen(process.env.PORT, "0.0.0.0", resolve));
console.log(`🚀 Server ready at ${JSON.stringify(httpServer.address())}`);
