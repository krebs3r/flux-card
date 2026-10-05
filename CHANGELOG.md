# Changelog

All notable changes to Flux Card are documented here.

## v1.2.5

### Changed
- Dark mode is the default, regardless of the system setting. Only an explicit click on the theme button is remembered; the previously auto-saved "auto" setting is discarded once.
- The theme button cycles dark → light → auto and shows the current mode: a moon in dark mode, a sun in light mode.

## v1.2.4

### Fixed
- The scrollbar in desktop Chrome is transparent over the page again instead of sitting in a purple gutter. On devices with a mouse the body is now the scroll container, so the track shows the page gradient like Firefox's overlay scrollbar. Touch devices keep document scrolling for iOS Safari.

## v1.2.3

### Added
- The footer shows the current version, linked to this changelog.

### Changed
- Light mode on phones uses lighter, less blurred glass, so the background effect stays visible behind the cards.
- On phones the first card starts below the language and theme buttons instead of underneath them, and the page padding respects the iPhone safe areas again.
- Cards no longer react to hover (extra 1px ring and brighter border removed), since they are not clickable.
- On touch devices the fluid effect is only slightly dimmed while the finger is on a card, since the cards fill almost the whole screen.

### Fixed
- Safari on iOS 26 no longer shows black bars at the notch and behind the address bar. The animated background now keeps clear of the screen edges on iOS and fades into the page gradient, so Safari no longer fills the bars with a solid color and the page scrolls underneath them.
- On first load the status bar on iOS shows a purple tone matching the page instead of black. Safari takes that color from the body's `background-color`, which is now a matching tone, while the page base color moved into the gradient layers.

## v1.2.2

### Changed
- Background orbs are drawn as soft radial gradients instead of large `filter: blur()` circles. This removes visible rings (banding) in Firefox and makes the animation cheaper to render.

## v1.2.1

### Fixed
- The background layer had no size because of an invalid `inset` value, so the background orbs were never visible. They now show up as intended.

### Changed
- Background orbs drift further (relative to the viewport) on mirrored paths instead of moving only a few pixels.
- The static gradient at the bottom edge is now a third orb that drifts slowly along the lower edge.
- Light mode uses soft lilac and light-blue orbs at reduced opacity instead of the dark colors from dark mode.
- Light mode footer uses dark text and a dark repository link, matching the other links.

## v1.2.0

### Added
- Interactive fluid background (`fluid.js`): a dependency-free WebGL2 fluid simulation that follows mouse and touch, tinted with `--accent` / `--accent-2` and updated on theme changes.
- CSS cursor-glow fallback for browsers without WebGL2 float render targets, and when the WebGL context is lost.
- `background` block in `content.js` with `effect` (`fluid` / `glow` / `orbs`), `intensity`, `fadeSeconds`, and `ambient`.
- `prefers-reduced-motion` support: the interactive layer stays off and the background orbs stop animating.

### Changed
- Computop Paygate Tester now links to `https://paygate.paytest.dev/`; the repository link was removed because the repo is no longer public.
- Project cards no longer require a repository link; the kicker falls back to the live URL's host.
- The fluid effect is dampened while the pointer is over cards and buttons, so content stays readable.
- Skill and project tags show the default cursor instead of the text cursor.

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
