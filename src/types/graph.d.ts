export const typeDefs = ["type Query {\n  sayGoodbye: String!\n  sayHello(name: String!): sayHelloResponse!\n}\n\ntype sayHelloResponse {\n  text: String!\n  error: Boolean!\n}\n"];
/* tslint:disable */

export interface Query {
  sayGoodbye: string;
  sayHello: sayHelloResponse;
}

export interface SayHelloQueryArgs {
  name: string;
}

export interface sayHelloResponse {
  text: string;
  error: boolean;
}
