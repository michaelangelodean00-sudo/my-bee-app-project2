// Exact hostname allowlist for the public-free design demo route.
// Published/custom domains are never listed, so demo content cannot render there.
const ALLOWED_HOSTS = new Set([
  "id-preview--fd0fbee7-53c9-4c82-885d-3738f7504d4f.lovable.app",
  "localhost",
  "127.0.0.1",
]);

export const isDesignDemoHost = (): boolean => {
  try {
    return ALLOWED_HOSTS.has(window.location.hostname);
  } catch {
    return false;
  }
};
