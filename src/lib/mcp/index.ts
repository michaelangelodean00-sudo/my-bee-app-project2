import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listApprovedBusinessesTool from "./tools/list-approved-businesses";
import getMyProfileTool from "./tools/get-my-profile";

// Build the OAuth issuer from the project ref (Vite inlines this literal at
// build time — no runtime env read, safe to evaluate at module load).
// SUPABASE_URL cannot be used: on Lovable Cloud it's a `.lovable.cloud` proxy
// and mcp-js rejects tokens whose configured issuer doesn't match the direct
// `supabase.co` issuer published in the discovery document.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "bee-app-mcp",
  title: "B.E.E App MCP",
  version: "0.1.0",
  instructions:
    "Tools for the B.E.E App Bahamas platform. Use `list_approved_businesses` to browse the public business directory. Use `get_my_profile` to read the signed-in user's own profile.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listApprovedBusinessesTool, getMyProfileTool],
});
