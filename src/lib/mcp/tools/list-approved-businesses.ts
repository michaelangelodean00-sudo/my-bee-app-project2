import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_approved_businesses",
  title: "List approved businesses",
  description:
    "Return the publicly-listed business profiles from the B.E.E App directory (approved businesses only).",
  inputSchema: {
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .describe("Maximum number of businesses to return (default 25)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }) => {
    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
    const { data, error } = await client
      .from("profiles")
      .select("id, business_name, business_category, phone, address, avatar_url")
      .eq("account_type", "business")
      .eq("status", "approved")
      .limit(limit ?? 25);
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { businesses: data ?? [] },
    };
  },
});
