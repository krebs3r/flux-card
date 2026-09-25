# Changelog

All notable changes to Flux Card are documented here.

## Unreleased

### Changed
- Computop Paygate Tester now links to `https://paygate.paytest.dev/`; the repository link was removed because the repo is no longer public.
- Project cards no longer require a repository link; the kicker falls back to the live URL's host.

## v1.1.1

### Changed
- Improved SEO metadata with canonical URL, robots preview directives, author metadata, and absolute Open Graph image URLs.
- Added ProfilePage / Person structured data for Martin Krebs, including social profile links and skill topics.
- Updated the canonical public URL to `https://martin-krebs.eu/`.

## v1.1.0

### Added
- Curated GitHub highlights section with repository cards, project tags, repo links, and live-demo links.
- Auto / Dark / Light theme mode. Auto follows the system preference and reacts to system changes.
- First-visit language detection based on browser language, defaulting to English unless German is detected.
- Dedicated `projects` configuration in `content.js`.

### Changed
- Refined the blurple glassmorphism design with a fixed atmospheric gradient background.
- Updated focus area icons to inline SVGs with theme-aware contrast.
- Reworked the theme toggle auto icon as a vertically split light/dark circle.
- Improved footer contrast in light mode.
- Improved iOS Safari safe-area handling so the background extends into top and bottom browser areas.
- Limited hover effects on top controls to mouse/trackpad devices to avoid sticky hover on touch screens.
- Updated `og-image.png` to match the refreshed visual style.
- Refined public skill tags and OG preview chips based on the profile PDF.

### Documentation
- Updated README features, editable content fields, version badge, and footer version.

## v1.0.0

- Initial release of Flux Card as a static, configurable digital business card.
- Added glassmorphism layout, dark/light mode, multilingual content, social links, focus areas, skill tags, contact form, Open Graph metadata, and GitHub Pages support.
