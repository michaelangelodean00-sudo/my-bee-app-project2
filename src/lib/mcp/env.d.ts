// Ambient types for MCP tool handlers. The MCP entry and its tool files are
// bundled into a Deno Edge Function at build time and read env via `process.env`
// (Deno polyfills `process` in Supabase Edge). In the Vite/browser typecheck we
// declare it here so TS doesn't require @types/node.
declare const process: {
  env: Record<string, string | undefined>;
};
