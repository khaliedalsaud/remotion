# Mission Academy — Motion Intro

27-second Arabic (RTL) motion intro, 1920×1080 and 1080×1920, 30fps.

Scenes: logo reveal → hook → about → 4 pillars → animated stats → CTA.

```bash
npm install
npm run studio            # edit all text, numbers and colors live in the right panel
npm run render            # out/mission-academy-promo.mp4 (16:9)
npm run render:vertical   # out/mission-academy-promo-9x16.mp4 (Reels/TikTok/Snap)
```

All copy lives in `src/schema.ts` (`defaultPromoProps`). The stats and pillars are
placeholders — replace them with the academy's real numbers before publishing.
