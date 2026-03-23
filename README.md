# Flux Card — Digital Business Card

> A modular, single-page digital business card with glassmorphism design.
> No server. No dependencies. Just edit one file and deploy.

![Version](https://img.shields.io/badge/version-1.0.0-blueviolet)
![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-active-brightgreen)

---

## Live Demo — [martin-krebs.eu](https://martin-krebs.eu)

No sign-up. No backend. Just a clean, responsive business card that works on any device.

---

## Overview

**Flux Card** is a modular digital business card that runs entirely in the browser. All content is stored in a single configuration file — no CMS, no framework, no build step. Fork it, swap the content, deploy it.

The interface follows a glassmorphism / acrylic design language with smooth animations, dark/light mode, and full mobile support. It looks like a native app, but it's just a few static files.

---

## Features

### Core
- **Modular content** — all personal data lives in `content.js`, the template stays untouched
- **Multi-language** — German & English out of the box, extensible to any language
- **Dark / Light mode** — toggleable, preference saved in localStorage
- **Contact form** — mailto-based with math captcha and honeypot spam protection
- **Social links** — GitHub, LinkedIn, E-Mail, and more (extensible via icon map)
- **Focus areas** — highlight your key competencies with icons and descriptions
- **Skills grid** — tag-based display of your technologies and expertise
- **Open Graph & Twitter Cards** — rich previews when shared on WhatsApp, Signal, LinkedIn, X, etc.

### Design
- **Glassmorphism UI** — acrylic-style backdrop-filter effects throughout
- **Animated background** — floating gradient orbs with smooth motion
- **Responsive** — optimized for desktop, tablet, and mobile
- **Smooth animations** — fade-up entrance effects on scroll

### Privacy
- **No tracking** — no analytics, no cookies, no server-side data collection
- **No dependencies** — no external JS libraries, no CDN scripts (except Google Fonts)
- **Hosted on GitHub Pages** — their [privacy policy](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement) applies

---

## Project Structure

```
flux-card/
  index.html      Template — structure & rendering logic
  style.css       Design — layout, themes, animations
  content.js      Content — the only file you need to edit
  profile.jpg     Avatar image
  favicon.svg     Browser tab icon
  og-image.png    Social media preview image
```

---

## Getting Started

### Use as your own business card

1. Fork or clone this repository
2. Edit `content.js` with your personal data
3. Replace `profile.jpg` with your photo
4. Deploy to GitHub Pages (or any static host)

```bash
git clone https://github.com/krebs3r/flux-card.git
cd flux-card
```

### What to edit in `content.js`

| Field | Description |
|---|---|
| `name` | Your full name |
| `role` | Your job title |
| `email` | Contact email (used in mailto form) |
| `avatar` | Path to your profile image |
| `meta` | Page title, OG tags, repo URL |
| `socialLinks` | Your social profiles (GitHub, LinkedIn, etc.) |
| `skills` | Array of skill tags |
| `focusAreas` | Key competencies with icons and i18n keys |
| `i18n` | All text content in each language |

### Available social link icons

`github` · `linkedin` · `mail` · `xing` · `twitter` · `website` · `phone`

Need another icon? Add the SVG to the `ICONS` object in `index.html`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 |
| Styling | CSS3 (custom properties, `backdrop-filter`, CSS Grid/Flex) |
| Logic | Vanilla JavaScript (ES6+) |
| Content | JavaScript object (`content.js`) |
| Dependencies | None |

---

## Browser Support

Works in all modern browsers that support `backdrop-filter`.

| Browser | Supported |
|---|---|
| Chrome / Edge 76+ | ✅ |
| Firefox 103+ | ✅ |
| Safari 14+ | ✅ |
| Mobile Chrome / Safari | ✅ |
| Legacy browsers | ⚠️ No glassmorphism |

---

## License

[MIT](LICENSE) — feel free to use, fork, and modify.

---

<p align="center">Made with focus · Flux Card v1.0.0</p>
