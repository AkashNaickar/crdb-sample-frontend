# STAGE 3 — Animation Spec: littlebird.ai

Authoritative motion reference for the rebuild. All times in seconds unless noted.
Reduced-motion: every motion component respects `prefers-reduced-motion: reduce` (JS checks `matchMedia('(prefers-reduced-motion: reduce)')` and CSS uses the media query).

---

## 1. Marquee (infinite loop)

- CSS keyframe `sp-marquee-scroll`, defined inline in home `<style>`:
  ```css
  @keyframes sp-marquee-scroll {
    from { transform: translate3d(0,0,0); }
    to   { transform: translate3d(-50%,0,0); }
  }
  ```
- Applied to `.sp-marquee-track`: `animation: sp-marquee-scroll 55s linear infinite`.
- Track contains the logo row twice (translate -50% = exactly one copy width → seamless loop).
- 14 logos: stanford, zendesk, ford, netflix, snowflake, yale, mit, nvidia, nyu, vogue, siemens, rippling, condenast, dhl (SVGs at `assets/images/marquee/`).

## 2. Scroll-reveal system (`cardsscrollrevealv3-1.0.0.js`)

- Adds `js-reveal` class to `<html>` and injects:
  ```css
  html.js-reveal .reveal { transition: opacity .6s ease, transform .6s ease; }
  html.js-reveal .reveal:not(.is-visible) { opacity: 0 !important; transform: translateY(28px); }
  ```
- `IntersectionObserver` (rootMargin ~`0px 0px -10% 0px`, threshold 0.1) adds `.is-visible` when scrolled into view.
- Bails out under `prefers-reduced-motion: reduce`.

## 3. Cards heading pop (`cardsheadingpop-1.0.0.js`)

- Inject: `.cards_heading_wrap{opacity:0;transform:scale(.92);transition:opacity .55s cubic-bezier(.2,.7,.2,1), transform .55s cubic-bezier(.2,.7,.2,1)}` + `.is-visible` state (opacity 1, scale 1).
- Same IO reveal pattern. Skipped under reduced motion.

## 4. Nav scroll reveal (`navscrollreveal-1.0.0.js`)

- `.nav_wrap` becomes `position:fixed; top:0; left:0; right:0; width:100%; max-width:1408px; margin:0 auto; padding:0 16px; box-sizing:border-box; z-index:1000; opacity:0; transform:translateY(-14px); pointer-events:none` until a scroll threshold (~40px) is crossed, then `.nav-visible` sets `opacity:1; transform:none; pointer-events:auto` with a smooth transition.
- Fixed top nav with blur backdrop (transition `backdrop-filter .4s` + `opacity .4s`).

## 5. Nav dropdown reveal (`navdropdownreveal-1.0.0.js`)

- Inject: `.nav_dropdown:hover .nav_dd_panel, .nav_dropdown:focus-within .nav_dd_panel { opacity:1!important; visibility:visible!important; pointer-events:auto!important; transform:translateX(-50%) translateY(0)!important; }` and caret rotation state. Panel uses `translateX(-50%)` centering + small `translateY` offset on hidden state.

## 6. Mobile nav (`navmobilemenu-1.0.3.js`)

- Burger toggles `nav-open` on `<html>`; `aria-expanded` synced. Menu slides/expands under `nav-open`, body scroll lock. Close on link click and Escape.

## 7. FAQ accordion (`faqaccordion-1.0.6.js`)

- Inject `.faq-row` transition CSS; toggles `.is-open` on click. Panel expand uses `max-height` transition `0.35s ease`. Only one row open at a time. Uses `scrollIntoView` on open.

## 8. Embed scroll-play (`embedscrollplay2-1.1.0.js`)

- Every `<iframe data-src="…">` is lazy-loaded: real `src` set only when within `200px` of viewport (IO rootMargin `'200px 0px'`, threshold 0.01). This is the site's only interaction with the 4 demo embeds.

## 9. Embed → parent height bridge (`heroembedautoheight-1.0.0.js` + `lbembedbridge-1.0.0.js`)

- Embeds post `{ type:'lb-hero-height', height }` (and lb-msg/lb-roles/lb-prob) via `postMessage`.
- Parent maps message types to iframe selectors and sets `iframe.style.height = h+'px'` — the embeds auto-size to their content.

## 10. Hero video Safari mask (`herovidsafarimask-1.0.0.js`)

- Injects `.hero_vid{-webkit-mask-image:radial-gradient(140% 88% at 50% 0%, #000 60%, transparent 100%);-webkit-mask-repeat:no-repeat;-webkit-mask-size:100% 100%}` — fades the video edges on WebKit.

## 11. OS-detect download button (`downloadosdetect-1.0.3.js`)

- Sniffs UA/platform → `os` in {mac-as, ios, android, windows, others}.
- Adds class `cta-mac-as / cta-ios / cta-android / cta-windows / cta-others` on the CTA; swaps button copy/icon per OS. `ctaiconfix` sets `mix-blend-mode:normal` for the icon.
- `ctaosshare` hooks `[data-os-share]`: on click uses `navigator.share` when available.

## 12. Team "how it works" stepper (`teamshowstepper-1.0.0.js`)

- Scroll-linked progress rail: `.teams_how2_fill` height/translate maps scroll progress through `.teams_how2_steps`; `requestAnimationFrame` updates; reduced-motion fallback to static.

## 13. Embedded app demos (4 iframes, self-contained; reuse verbatim)

Each embed is fully self-contained (inline CSS/JS/SVG, base64 fonts, zero network) and drives its own animation timeline. Reuse the saved files as-is:

| File | Size (px) | Keyframes | JS driver |
|---|---|---|---|
| `apps-animation.html` | 583×604 | `drift`, `blink` | rAF timeline, BEAT=6500ms, TEMPO=0.7, 4 beats (linear→gmail→slack→notion), ring rotation SLOTS[8], typing, send arc `stroke-dashoffset` reveal, history pairs, hover/visibility pause, `__apps` API (pause/play/seek/finish), ResizeObserver scale to 583 width |
| `meetings-animation-2.html` | 583×540 | `lwave`,`rwave`,`shimmer` | rAF scroll-linked; equalizer bars (scaleY), shimmer text sweep (bg-position 200%→-200%), auto-height postMessage |
| `routines-animation-duo-2.html` | 583×604 | `pulse`, `breathe` | rAF timeline; list-item pulse (scale 1.14) + breathe (opacity .35), toggle pattern |
| `drafting-animation-1.html` | 583×556 | `pop` | rAF timeline; drafting tool pop (scale .93), path draw |

### Timeline shape (apps embed — representative)
1. `t+50/500` ensure correct app chip rotated to hero slot
2. `t+1000` composer `.typing`
3. `t+1200→3300` type prompt text (2000ms span, humanized jitter)
4. `t+3300` send button `.armed`
5. `t+3600` send `.fired`, connection dots `.on`, arc draws via `stroke-dashoffset` (easeOutCubic 600ms)
6. `t+3900` hero chip `.lit`, arc `.focus`
7. `t+5200` typing off, prompt `.lift`
8. `t+5500` history pair enters (`slide/fade .enter`)
9. `t+5750` clear prompt, send un-armed
10. `t+5950` arc off, chip unlit, focus off
Loop seam resets beat state; ring + history carry over. Pause on hover/tab-hide/`__apps.pause()`.

---

## Rebuild rules
- Port keyframes exactly as written above (do not re-time).
- Reuse the 4 embed files byte-for-byte from `recon/dump/embeds/`.
- All scroll reveals use the same IO pattern; respect reduced-motion.
- Nav = fixed, blur backdrop, reveal on scroll threshold.
- Do NOT reimplement embed internals — they are already captured verbatim.
