export const typeDefs = ["type Query {\n  sayGoodbye: String!\n  sayHello: Greeting!\n}\n\ntype Greeting {\n  text: String!\n  error: Boolean!\n}\n"];
/* tslint:disable */

export interface Query {
  sayGoodbye: string;
  sayHello: Greeting;
}

export interface Greeting {
  text: string;
  error: boolean;
}
