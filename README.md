# Littlebird.ai Static Rebuild

A pixel-perfect static rebuild of [littlebird.ai](https://littlebird.ai), built from captured assets and reverse-engineered interactions.

## Stack

- Pure HTML/CSS/JS (no frameworks)
- jQuery 3.5.1 (inherited from Webflow)
- 15 custom interaction scripts
- 5 self-contained iframe embeds

## Design Tokens

- Background: `#fffdf5`
- Text: `#1b1c14`
- Fonts: Meraki, Soehne Buch, Soehne Halbfett, Soehne Kraftig
- Breakpoints: 479px, 767px, 991px, 1440px

## Structure

```
site/
├── index.html          # Main page
├── css/style.css       # Full CSS with responsive MQ
├── js/main.js          # All interaction scripts
├── fonts/              # Meraki + Soehne font files
├── images/             # All mapped assets
│   └── marquee/        # Marquee logos
└── embeds/             # 5 self-contained iframes
    └── fonts/          # Embed-specific fonts

recon/
├── dump/               # Captured raw assets from live site
├── media/              # Extracted media files
├── mirror/             # wget mirror of littlebird.ai
├── screenshots/        # Reference screenshots
├── sections/           # Extracted HTML sections
├── verify/             # Verification screenshots
├── animations-spec.md  # Animation specifications
└── design-spec.md      # Design token specifications
```

## Running Locally

```bash
cd site
python -m http.server 8123
# Open http://localhost:8123
```

## Key Features

- Scroll-linked card animation (converge at hero center, spread like branches)
- OS-detect CTA switching (Mac/Windows/iOS/Android)
- FAQ accordion with smooth height transitions
- Embed lazy-load with height bridge (postMessage)
- Nav scroll reveal + blur
- Mobile responsive down to 375px

## License

For educational purposes only. Original design by Littlebird.
