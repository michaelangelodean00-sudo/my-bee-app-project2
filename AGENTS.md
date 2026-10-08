# Project Rules

- Keep date-aware holiday presentation isolated in `HolidayTicker`; this prevents seasonal logic from spreading through shared navigation.
- Never show a holiday greeting fallback in the preview; the ticker must appear only during actual holiday windows (per user request).- Demo/sample content renders only through `usePreviewMode` (admin role + session toggle), never by build mode alone; preview links can be public.
- Home is Header → `AdSplash variant="compact"` → `BeeNowSection`; nothing goes between the splash and BeeNow so both stay above the fold.
