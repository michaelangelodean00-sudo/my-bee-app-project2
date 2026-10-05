# Apply the New Bee App Logo Everywhere

## Scope
- Use the uploaded Bee App Bahamas logo in the header, empty states, and missing-page screen.
- Create optimized versions for browser tabs, Apple devices, and installable app icons without stretching the wide artwork.
- Update the install manifest, preload list, service-worker cache, and social-sharing metadata.
- Remove obsolete logo references and verify desktop and mobile rendering.

## Technical details
- Host the main wide logo through the project asset system.
- Generate padded square PNG icons from the uploaded artwork for favicon and install surfaces.
- Keep the supplied artwork’s proportions intact and update cache identifiers so existing installs receive it.
