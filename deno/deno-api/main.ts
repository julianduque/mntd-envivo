import { 
  Application, 
  Router,
  flags
} from "./deps.ts";


const DEFAULT_PORT = 8080;
const argPort = flags.parse(Deno.args).port;
const port = argPort ? Number(argPort) : DEFAULT_PORT;

if (isNaN(port)) {
  console.error("Port is not a number.");
  Deno.exit(1);
}

import { executeQuery } from "./lib/graphql.ts";

const app = new Application();
const router = new Router();

router.get("/", async (ctx) => {
  ctx.response.body = "Hello world"!;
});

router.post("/graphql", async (ctx) => {
  const body = await ctx.request.body();
  try {
    const response = await executeQuery(body.value.query);
    ctx.response.body = response;
  } catch (err) {
    ctx.response.body = err.message;
  }
});

app.use(router.routes());

await app.listen({ port });
