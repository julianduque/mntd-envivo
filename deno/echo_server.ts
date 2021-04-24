const listener = Deno.listen({ port: 5000 });
for await (const conn of listener) {
  Deno.copy(conn, conn);
}