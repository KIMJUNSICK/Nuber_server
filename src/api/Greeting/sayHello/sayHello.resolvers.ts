import { sayHelloResponse, SayHelloQueryArgs } from "src/types/graph";

const resolvers = {
  Query: {
    sayHello: (_, args: SayHelloQueryArgs): sayHelloResponse => {
      return {
        error: false,
        text: `Typescript is awesome!, like ${args.name}`
      };
    }
  }
};

export default resolvers;
