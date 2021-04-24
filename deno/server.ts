import { serve } from "https://deno.land/std@v0.53.0/http/server.ts";

const s = serve({ port: 8080 });
for await (const req of s) {
  req.respond({ body: "Hello from Deno!" });
}