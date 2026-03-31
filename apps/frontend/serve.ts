import { resolve } from "path";
import handler from "./dist/server/server.js";

const clientDir = resolve(import.meta.dir, "dist/client");

Bun.serve({
  port: Number(process.env.PORT) || 3333,
  async fetch(req) {
    const url = new URL(req.url);

    // Serve static files from dist/client
    const filePath = clientDir + url.pathname;
    const file = Bun.file(filePath);
    if (await file.exists()) {
      return new Response(file);
    }

    // SSR handler
    return handler.fetch(req);
  },
});

console.log(`Listening on port ${process.env.PORT || 3333}`);
