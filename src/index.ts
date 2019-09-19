import dotenv from "dotenv";
dotenv.config();
import { Options } from "graphql-yoga";
import { createConnection } from "typeorm";
import app from "./app";
import connectionOptions from "./ormConfig";
import decodeJWT from "../src/utils/decodeJWT";

const PORT: number | string = process.env.PORT || 4000;
const PLAYGROUND: string = "/playground";
const GRAPHQL_ENDPOINT: string = "/graphql";
const SUBSCRIPTION_ENDPOINT: string = "/subscription";

const appOptions: Options = {
  port: PORT,
  endpoint: GRAPHQL_ENDPOINT,
  playground: PLAYGROUND,
  subscriptions: {
    path: SUBSCRIPTION_ENDPOINT,
    onConnect: async connectionParams => {
      const token = connectionParams["JWT"];
      if (token) {
        const user = await decodeJWT(token);
        if (user) {
          return {
            currentUser: user
            // Where this data go to? req!
          };
        }
      }
      throw new Error("No JWT. Can't subscribe");
    }
  }
};

const handleAppStart = () =>
  console.log(`Listening on:✅  http://localhost:${PORT}`);

createConnection(connectionOptions)
  .then(() => {
    app.start(appOptions, handleAppStart);
  })
  .catch(error => console.log(error));
