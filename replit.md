# digibeg Landing Page

## Overview
A bilingual (German/English) landing page for "digibeg" - a digital assistant application. Static website hosted on IONOS via manual FTP upload. The main app runs at https://app.digibeg.de/.

## Project Structure
- `index.html` - German landing page (main)
- `index-en.html` - English landing page
- `impressum.html` - Impressum (German legal notice)
- `impressum-en.html` - Legal Notice (English)
- `datenschutz.html` - Datenschutzerklärung (German privacy policy)
- `datenschutz-en.html` - Privacy Policy (English)
- `style.css` - Additional CSS styles (not currently linked)
- `app.js` - JavaScript for smooth scrolling functionality

## Tech Stack
- Static HTML/CSS/JS
- Served with `serve` npm package
- All styles inline per page
- CI brand color: #FB923C (orange)

## Bilingual Support
- All 6 pages have a DE/EN language switcher in the top-right corner
- Active language shown in orange (#FB923C), inactive in gray
- Each page links to its counterpart (e.g., index.html ↔ index-en.html)

## Design
- Mobile-first with @media breakpoint at 600px
- Dark theme with dark navy background
- Brand color: #FB923C (rgb(251, 146, 60))
- Full-width hero on mobile, rounded corners on desktop

## Legal Contact
- René Gäng, Kolpingstraße 62, 68753 Waghäusel, Deutschland
- Email: info@digibeg.de

## Running Locally
The website is served using `npx serve -l 5000` on port 5000.

## Deployment
- Development: Served via Replit on port 5000
- Production: Manual FTP upload to IONOS hosting
- All 6 HTML files must be uploaded to IONOS for full deployment
