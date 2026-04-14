import { resolve } from "path";
import handler from "./dist/server/server.js";

const clientDir = resolve(import.meta.dir, "dist/client");
const API_URL = (process.env.API_URL || process.env.VITE_API_URL || "http://localhost:3434").replace(/\/+$/, "");

const SKILL_MD = await Bun.file(resolve(import.meta.dir, "../../packages/cli/SKILL.md")).text();

const INDEX_JSON = JSON.stringify({
  skills: [
    {
      name: "tokenrip",
      description:
        "Agentic collaboration platform — publish and share assets, send messages, manage threads, and collaborate with other agents using the tokenrip CLI. Use when: publish an asset, share a file, upload a PDF, send a message to an agent, create a shareable link, share my work, collaborate with another agent.",
      files: ["SKILL.md"],
    },
  ],
});

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "public, max-age=3600",
};

// Match /s/{uuid} and optionally /s/{uuid}/{versionId}
const ASSET_PATH_RE = /^\/s\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}))?$/;

function preferredType(accept: string | null): "html" | "markdown" | "json" {
  if (!accept) return "html";
  // If text/html is present, always prefer it (browser default)
  if (accept.includes("text/html")) return "html";
  if (accept.includes("text/markdown")) return "markdown";
  if (accept.includes("application/json")) return "json";
  return "html";
}

Bun.serve({
  port: Number(process.env.PORT) || 3333,
  async fetch(req) {
    const url = new URL(req.url);

    // /.well-known/skills/ — agent skill discovery
    if (url.pathname.startsWith("/.well-known/skills/")) {
      if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
      }
      if (url.pathname === "/.well-known/skills/index.json" || url.pathname === "/.well-known/skills/") {
        return new Response(INDEX_JSON, {
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      }
      if (url.pathname === "/.well-known/skills/tokenrip/SKILL.md") {
        return new Response(SKILL_MD, {
          headers: { ...CORS_HEADERS, "Content-Type": "text/markdown; charset=utf-8" },
        });
      }
      return new Response("Not found", { status: 404, headers: CORS_HEADERS });
    }

    // Serve /.well-known/llms.txt from the same file as /llms.txt
    if (url.pathname === "/.well-known/llms.txt") {
      const file = Bun.file(clientDir + "/llms.txt");
      if (await file.exists()) {
        return new Response(file, {
          headers: { "Content-Type": "text/markdown; charset=utf-8" },
        });
      }
    }

    // Serve static files from dist/client
    const filePath = clientDir + url.pathname;
    const file = Bun.file(filePath);
    if (await file.exists()) {
      return new Response(file);
    }

    // Content negotiation for asset pages
    const assetMatch = url.pathname.match(ASSET_PATH_RE);
    if (assetMatch) {
      const uuid = assetMatch[1];
      const versionId = assetMatch[2];
      const accept = req.headers.get("accept");
      const type = preferredType(accept);

      if (type === "markdown") {
        // Proxy to backend content endpoint
        const contentUrl = versionId
          ? `${API_URL}/v0/assets/${uuid}/versions/${versionId}/content`
          : `${API_URL}/v0/assets/${uuid}/content`;
        try {
          const upstream = await fetch(contentUrl);
          if (!upstream.ok) {
            return new Response(
              JSON.stringify({ ok: false, error: "NOT_FOUND", message: "Asset not found" }),
              { status: upstream.status, headers: { "Content-Type": "application/json", "Vary": "Accept" } },
            );
          }
          const headers = new Headers(upstream.headers);
          headers.set("Vary", "Accept");
          return new Response(upstream.body, { status: upstream.status, headers });
        } catch {
          return new Response(
            JSON.stringify({ ok: false, error: "UPSTREAM_ERROR", message: "Failed to fetch content" }),
            { status: 502, headers: { "Content-Type": "application/json", "Vary": "Accept" } },
          );
        }
      }

      if (type === "json") {
        // Proxy to backend metadata endpoint
        const metaUrl = versionId
          ? `${API_URL}/v0/assets/${uuid}/versions/${versionId}`
          : `${API_URL}/v0/assets/${uuid}`;
        try {
          const upstream = await fetch(metaUrl);
          const headers = new Headers(upstream.headers);
          headers.set("Vary", "Accept");
          return new Response(upstream.body, { status: upstream.status, headers });
        } catch {
          return new Response(
            JSON.stringify({ ok: false, error: "UPSTREAM_ERROR", message: "Failed to fetch metadata" }),
            { status: 502, headers: { "Content-Type": "application/json", "Vary": "Accept" } },
          );
        }
      }

      // HTML path — SSR with Link headers
      try {
        // Fetch asset metadata for Link header (mimeType)
        const metaUrl = `${API_URL}/v0/assets/${uuid}`;
        const [ssrResponse, metaResponse] = await Promise.all([
          handler.fetch(req),
          fetch(metaUrl).catch(() => null),
        ]);

        const headers = new Headers(ssrResponse.headers);
        headers.set("Vary", "Accept");

        // Add HTTP Link headers for agent discovery
        if (metaResponse?.ok) {
          try {
            const meta = await metaResponse.json();
            const mimeType = meta.data?.mimeType || "application/octet-stream";
            const links = [
              `<${API_URL}/v0/assets/${uuid}>; rel="alternate"; type="application/json"`,
              `<${API_URL}/v0/assets/${uuid}/content>; rel="alternate"; type="${mimeType}"`,
            ];
            headers.set("Link", links.join(", "));
          } catch {
            // Skip Link headers if metadata parsing fails
          }
        }

        return new Response(ssrResponse.body, { status: ssrResponse.status, headers });
      } catch {
        // Fall through to default SSR
      }
    }

    // SSR handler
    return handler.fetch(req);
  },
});

console.log(`Listening on port ${process.env.PORT || 3333}`);
