# أكاديمية ميشن — فيلم تعريفي (60 ثانية)

Remotion project for a 60-second Arabic editorial explainer for **Mission Academy**,
1920×1080 @ 30fps (1800 frames). Creative idea: «من المعرفة… إلى الممارسة.» — a single
blue *knowledge thread* that starts as an underline, becomes the path linking learning,
practice and development, and ends beside the logo.

## Run / export

```bash
npm install
npm run studio      # live preview + timeline (composition: MissionAcademyIntro)
npm run render      # → out/mission-academy-intro.mp4 (H.264, 1080p)
npm run cover       # → out/cover.png (frame 1520: the answer «من المعرفة… إلى الممارسة.» beside the opened window)
npm run render:clean  # → out/mission-academy-intro-no-captions.mp4 (pair with voiceover/captions.srt)
npm run captions    # → voiceover/voiceover-script.md, captions.srt, timings.json
npm run typecheck
```

Props on `MissionAcademyIntro`: `captions` (burned-in Arabic captions, default on) and
`sfx` (transition sounds, default on), e.g.
`npx remotion render MissionAcademyIntro out/clean.mp4 --props='{"captions":false,"sfx":true}'`.

## Where things live

| What | File |
|---|---|
| Colors, fonts, weights, thread style, logo metadata | `src/config/brand.ts` |
| Scene timing (frames) | `src/config/timing.ts` |
| On-screen text, voice-over lines + caption timings, emphasis cues | `src/config/script.ts` |
| Photo slots, voice-over / music / SFX files | `src/config/assets.ts` |
| Safe areas, caption band, match-cut handoff geometry | `src/config/layout.ts` |
| Scenes 1–8 | `src/scenes/Scene*.tsx` |
| Reusable pieces (Clip, Words, Highlight, Callout, ThreadPath, Camera, LogoMark, Captions, Sfx) | `src/components/` |
| Editorial illustrations (one per slot) + shared drawing kit | `src/illustrations/` |
| Logo (transparent PNG cut from the supplied JPG, unaltered) | `public/brand/` |
| Fonts (IBM Plex Sans Arabic / IBM Plex Sans, bundled — renders work offline) | `public/fonts/` |

## Replacing illustrations with real photos

Every image window reads from a *slot*. Put a photo in `public/images/` and set its path in
`PHOTOS` (`src/config/assets.ts`), e.g. `training: 'images/training.jpg'`. The clipping
switches from the illustration to the photo (object-fit: cover). Use real, cleared academy
photos only — the illustrations are deliberately abstract so they are never mistaken for the
academy's own facilities or events.

## Adding the voice-over and music

1. Record from `voiceover/voiceover-script.md` (natural pace — do not speed it up to fit).
2. Save as `public/audio/voiceover.wav` (starts at 0:00) and set `VOICEOVER_AUDIO` in `src/config/assets.ts`.
3. Re-time the `VOICEOVER` chunks in `src/config/script.ts` to the real audio (captions and SRT follow), then `npm run captions && npm run render`.
4. Licensed music: set `MUSIC.src` (kept under the narration at volume 0.12).

## Recomposing for 9:16 later

Scene geometry is read from `src/config/layout.ts` (canvas, safe area, caption band,
handoffs) and text from `src/config/script.ts`. A vertical cut = a second layout preset with
the same keys, a 1080×1920 `<Composition>` in `src/Root.tsx`, and per-scene placement updates.

## Regenerating assets

```bash
python3 scripts/prepare-logo.py   # logo-source.jpg → transparent logo-mark PNGs + metadata
node scripts/fetch-fonts.mjs      # IBM Plex woff2 subsets + manifest
python3 scripts/make-paper.py     # paper grain texture
node scripts/synth-sfx.mjs        # procedural, license-free transition sounds
```

## Status of assets

- **Voice-over:** not recorded. The film ships with burned-in Arabic captions timed to the
  proposed narration (`voiceover/`); the clean render pairs with `captions.srt`.
- **Photos:** none supplied → every clipping uses an abstract editorial illustration.
- **Logo:** only the mark (255 px JPEG) was supplied. It is used unaltered (background removed,
  never recolored or redrawn), shown at ≤ 1.3× its native size, and on the deep-blue end card it
  sits on a white badge because no dark-background version exists. Needed: SVG or high-res
  mark, the official Arabic/English wordmark lockup, and a white/negative version.
- **Website:** `new.missionacademy.sa` exactly as supplied — confirm the public domain.
- **Music:** none (no licensed track supplied). SFX are procedurally synthesised, license-free.
