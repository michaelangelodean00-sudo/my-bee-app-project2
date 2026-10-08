# Project Rules

- Keep date-aware holiday presentation isolated in `HolidayTicker`; this prevents seasonal logic from spreading through shared navigation.
- Never show a holiday greeting fallback in the preview; the ticker must appear only during actual holiday windows (per user request).- Demo/sample content renders only through `usePreviewMode` (admin role + session toggle), never by build mode alone; preview links can be public.
- Home is Header → optional admin-only preview control → `AdSplash variant="compact"` → `BeeNowSection`; nothing goes between the splash and BeeNow to preserve the public content hierarchy.
- Share preview discoverability controls through `DesignPreviewControl` and the existing `usePreviewMode` gate; URL activation waits for admin authorization and remains tab-local.
- Keep fictional Splash inventory in `demoAds` and generated-photo feed inventory in `demoContent`, separate from real feed hooks; this prevents creative preview content leaking into production records.
- Use tap-controlled CSS photo motion for demo feed media and stop active motion through shared scroll/visibility events, not per-card observers; this keeps preview media lightweight and silent without implying recorded video.
