# Project Rules

- Keep date-aware holiday presentation isolated in `HolidayTicker`; this prevents seasonal logic from spreading through shared navigation.
- Show a holiday greeting fallback only in development preview; this makes seasonal presentation reviewable without affecting production dates.