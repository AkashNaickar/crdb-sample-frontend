# Littlebird.ai — Design System Spec (reverse-engineered)

Source: https://littlebird.ai/ (captured 2026-08-01)
Stack: **Webflow** (jQuery 3.5.1 + Tailwind-style utility classes via Webflow), self-contained iframe embeds, no React/Vue.

## Colors
- Background: `#fffdf5` (cream) — site-wide
- Primary text: `#1b1c14` (near-black olive)
- Text alphas: `#1b1c14cc` (80%, subheads), `#1b1c1499` (60%), `#1b1c14a6`, `#1b1c14b3`
- Buttons (primary): `#1b1c14` bg, `#fff` text
- CTA card button: `#f6edd7` (cream chip) bg, `#1b1c14` text
- Accent green: `#00694e` (hummingbird/stepper dots, pills)
- Testimonial card bg: `#fff`, border `#0000001a`
- Quote card bg: `#fbf8ef`
- Footer text: `#00000080`
- Marquee label: `#55554e`
- CTA fineprint: `#fff` at 0.9 opacity
- Nav divider: `#1b1c1426`
- Privacy card bg (desktop): `#fff9e9`, radius 20px

## Typography
- **Body**: `Sohne Buch` (400). Body text 17-20px, line-height 26-28px
- **Display headings (hero/section/cta)**: `Meraki` (400) serif, sizes 52-68px, letter-spacing -1 to -3px, line-height 1.05-1.2
- **Buttons / names**: `Soehne Halbfett` (semibold)
- **FAQ titles**: `Soehne Kraftig` (bold)
- **Nav links**: `Sohne Buch` 14px/20px, color `#1b1c1499`
- Font files captured: `soehne-kraftig.woff2`, `soehne-halbfett.woff2`, `Meraki-Regular.woff2`, `sohne-400.woff2`, `sohne-600.woff2`, `TestSöhne-Buch.otf`, `Sohne-Regular.otf` (in embed base64)

## Layout
- Max content: 1100-1408px
- Section vertical padding: 120-160px (apps), 80-100px (testi/priv), footer 80px
- Nav: fixed, max-width 1408px, backdrop-blur after scroll (nav-blur gradient + blur layers)
- Breakpoints: 991px (tablet), 767px (mobile), 479px (small phone), 1440px+ (desktop wide)

## Components

### Nav
- `nav_wrap`: fixed top, 100%, max-width 1408px, padding 8px 16px, z-index 1000
- `nav_side`: padding 16px 24px, flex
- Logo 22px height; nav links gap 20px, 14px `Sohne Buch` color `#1b1c1499`
- Divider: 1x12px `#1b1c1426`
- CTA: pill `#1b1c14` bg, white text, `Soehne Halbfett` 14px, padding 8px 16px, radius 99px
- Dropdown: hover/focus reveals panel (`nav_dd_panel` opacity/visibility/translate transition 0.18s), caret rotates 180deg
- Dropdown card: `#fffdf5` bg, border `#1b1c141a`, radius 16px, shadow `0 12px 32px -8px #1b1c1429, 0 2px 6px -2px #1b1c1414`, min-width 244px
- Mobile (≤991): nav links hidden, burger menu with 3-bar → X animation; nav becomes sticky with `backdrop-filter: blur(14px)` + `#fffdf5bf`

### Hero
- `section_hero`: `#fffdf5`, padding 16px 16px 0, overflow hidden
- Background video (`hero_vid`) with radial mask `radial-gradient(140% 88% at 50% 0%, #000 60%, transparent 100%)`
- Heading: Meraki 68px (desktop), -3px letter-spacing, max-width 796px
- Subhead: `Sohne Buch` 20px/28px, `#1b1c14cc`, max-width 510px
- CTA: `btn_primary` pill, `#1b1c14` bg, white, `Soehne Halbfett` 16px, padding 10px 20px, radius 999px, inset shadow `0 1px 1px #0003`; OS-detected (mac/windows/ios/android) via `downloadosdetect`
- Fineprint: 16px (e.g. "Beta · Windows 10+")
- Mobile: heading 54-60px, subhead 16-18px

### Cards section (hero bottom — floating app cards)
- `cards_stage`: 1440px wide, 882px tall, centered via translate(-50%)
- `cards_heading_wrap`: centered, max-width 620px, at top 55%, scale-in on scroll (0.92→1)
- 11 floating cards `card_p0`..`card_p10`, absolute positioned at exact x/y with widths 151-235px, staggered reveal (delay 0-0.8s), transition opacity/transform 0.6s
- Reveal: `translateY(28px)` → visible; `flow_top` variant: `translateY(-140px) scale(.86)` with cubic-bezier(.22,1,.36,1) 0.9s
- Ray background image behind cards

### Apps sections (4 alternating)
Each: `section_apps` bg `#fffdf5`, padding 160px 16px 120px, `apps_wrap` max-width 1100px flex row
1. **An assistant across all your apps** — quote card (Brian Clegg) + apps-animation iframe embed (583x604)
2. **Never take meeting notes again** — meetings-animation-2 iframe (583x540)
3. **Automate your schedules and briefs** — quote card (Gretchen Schoser) + routines-animation-duo-2 iframe (583x604)
4. **From blank page to final draft** — drafting-animation-1 iframe (583x556)
- Headings: Meraki 52px, -1px tracking; subhead `Sohne Buch` 20px `#1b1c1499`
- `meet_btn`: pill, border `#0000001a`, radius 999px, padding 9px 19px, `Soehne Buch` 16px semibold
- Quote card: `#fbf8ef`, radius 12px, padding 16px 20px 20px, avatar 49px offset left
- Mobile (≤767): stacked column, heading 34px, embed full width

### Hummingbird section
- `humming_card`: aspect-ratio 1274/644, radius 40px, overflow hidden, max-width 1274px
- bg image; heading Meraki 52px white; subhead `Sohne Buch` 24px white
- Mobile: aspect auto, min-height 640px, bg image hidden → mobile bg shown, overlay content

### Marquee
- Label: `#55554e` 17px centered ("Used by some of the most successful people...")
- Track: flex, gap 80px (50px/40px by breakpoint), `@keyframes sp-marquee-scroll` translate3d 0→-50%, 55s linear infinite (42s ≤991px; none on reduced-motion)
- Logos: 14 companies, each `--w`/`--h` CSS vars scaled by `--f` (1 / 0.8 / 0.65 by breakpoint)
- Viewport mask: `linear-gradient(90deg,#0000 0%,#000 10% 90%,#0000 100%)`

### Testimonials
- Heading: Meraki 52px "From people who use Littlebird every day"
- Masonry `column-count:3` gap 17px, max-width 1100px; ≤767: 1 column
- Card: `#fff` bg, border `#0000001a`, radius 24px, padding 20px, margin-bottom 17px
- Quote: `Sohne Buch` 16px/24px; author: name `Soehne Halbfett` 14.82px, handle `#1b1c149c`; avatar 48px radius 8px; X icon 20px
- 6 testimonials (Lenny Rachitsky, Scott Belsky, Gokul Rajaram, Joe Speiser, swyx, Russ Heddleston)

### Privacy/Security
- Title Meraki 52px; subhead `Sohne Buch` 20px `#1b1c1499`
- `privacy-grid`: 3 columns, gap 40px, max-width 1100px; cards stack column on mobile
- Card: image (webp) + subheading + desc; desktop padding 40px radius 20px `#fff9e9` (privacy-card)

### FAQ
- `faq-flex`: 2-col (left header 500px, right list), gap 40px; ≤991 stacked
- Row: title `Soehne Kraftig` 16px/140% `#000000e6`, plus icon 16px rotates 45deg when open
- Answer: `Sohne Buch` 16px/150%, max-height 0→scrollHeight transition 0.35s ease
- Open row: plus rotates 45deg

### CTA
- `cta_card`: aspect 1274/658, radius 32px, padding 128px 112px, bg image (dark), overflow hidden
- Heading Meraki 68px white -3px; subhead `Sohne Buch` 20px/300 weight
- `cta_btn`: `#f6edd7` pill radius 999px, padding 12px 24px, icon `mix-blend-mode:difference`
- Fineprint: white 0.9 opacity ("Free to start • Available for Windows, iOS, and Android")
- Mobile: padding 36px 22px, heading 38px

### Footer
- `section_footer`: padding 40px 132px 170px, gap 70px; container max-width 1180px
- Divider `#1b1c141a`; brand col (logo 135px) + socials (28px icons) + 4 link cols (gap 16px)
- Col title: Meraki 24px; links `#00000080`; legal row
- Bottom: newsletter form (Email input + button), "Get download link"

## Animations summary
1. Marquee scroll (CSS keyframes, 55s/42s)
2. Nav reveal on scroll >90px (opacity + translateY -14px, 0.35s) + blur gradient backdrop
3. Dropdown reveal (hover/focus, 0.18s + caret 180deg)
4. Card reveal (IntersectionObserver, threshold 0.12, translateY 28px / flow_top variant)
5. Cards heading pop (scale 0.92→1, cubic-bezier(.2,.7,.2,1) 0.55s)
6. FAQ accordion (max-height 0.35s ease + plus rotate 0.3s)
7. Mobile nav (burger→X, menu slide)
8. Team/stepper scroll fill (opacity + green dots, fill height)
9. Hero video background (autoplay loop, radial mask)
10. iframe embeds lazy-load on scroll (rootMargin 200px)
11. Embeds: 4 self-contained animated demos (app rings rotating, meeting notes, routines, drafting) — inline CSS/JS/SVG, base64 fonts

## Rebuild assets
- Fonts: `recon/dump/assets/fonts/*.woff2` + otf
- Marquee logos: `recon/dump/assets/images/marquee/*.svg`
- Testimonial avatars: `recon/dump/assets/images/*.webp/jpg` + testi-*.webp
- Privacy images: `recon/dump/assets/images/privacy-*.webp`
- Icons: apple.svg, icon-windows.svg, plus.svg, send.svg, logo.svg, icon-arrow-right.svg.svg
- Hero video: bg-vid mp4/webm (poster jpg) — re-fetch from CDN
- Embeds: `recon/dump/embeds/*.html` (self-contained, drop-in)
