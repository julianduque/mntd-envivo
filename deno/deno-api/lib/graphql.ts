import { graphql, buildSchema } from "../deps.ts";

const schema = buildSchema(`
  type Query {
    helloWorld: String
  }
`);

const root = {
  helloWorld: () => 'Hola from GraphQL in Deno'
};

export async function executeQuery (query: any) {
  return graphql(schema, query, root);
}