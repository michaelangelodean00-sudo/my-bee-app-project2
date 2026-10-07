# Project Rules

- Keep date-aware holiday presentation isolated in `HolidayTicker`; this prevents seasonal logic from spreading through shared navigation.
- Never show a holiday greeting fallback in the preview; the ticker must appear only during actual holiday windows (per user request).