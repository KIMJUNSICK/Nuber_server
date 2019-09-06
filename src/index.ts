import { Options } from "graphql-yoga";
import app from "./app";

require("dotenv").config();

const PORT: number | string = process.env.PORT || 4000;
const PLAYGROUND: string = "/playground";
const GRAPHQL_ENDPOINT: string = "/graphql";

console.log(PORT);

const appOptions: Options = {
  port: PORT,
  endpoint: GRAPHQL_ENDPOINT,
  playground: PLAYGROUND
};

const handleAppStart = () =>
  console.log(`Listening on:✅  http://localhost:${PORT}`);

app.start(appOptions, handleAppStart);
