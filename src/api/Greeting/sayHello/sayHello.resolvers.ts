import { Greeting } from "src/types/graph";

const resolvers = {
  Query: {
    sayHello: (): Greeting => {
      return {
        error: false,
        text: "Typescript is awesome!"
      };
    }
  }
};

export default resolvers;
