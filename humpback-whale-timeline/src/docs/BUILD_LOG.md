# Build Log — The New Ocean

Running notes during the weekend build. Raw material for the 
dev.to post and for my own memory later.

## Friday, April 17

### Audio sourcing workflow
Downloaded humpback source as MP4 from [source], extracted audio 
with ffmpeg:
`ffmpeg -i source.mp4 -vn -acodec pcm_s16le -ar 48000 -ac 1 whale_source.wav`

Built a two-script workflow instead of editing by hand in Audacity:
- `scripts/find_clips.py` — uses librosa to detect non-silent regions, 
  scores them by RMS energy and spectral flatness, exports top 15 
  candidates as Audacity labels file
- `scripts/export_clips.py` — takes chosen timestamps, applies 200ms 
  fade in, 300ms fade out, normalizes to -3dB, exports as 48kHz mono WAV

Time cost: ~30 min total (vs. ~75 min doing it by hand). Human decision 
moment: listening through the 15 candidates to pick 6. AI couldn't do 
that part — too much depends on emotional register and variety.

### [Other Friday notes as you go]

## Saturday, April 18

## F3 — Gemini narration prompt (SHIPPED to AI Studio, ready to wire)

**Status:** Prompt finalized. Produces on-register output across all 5 test years. Ready to wire into `api/narrate.ts`.

**Shipped config (AI Studio):**
- Model: Gemini 2.5 Pro
- Temperature: 0.9
- Top-P: 0.95
- Thinking budget: 512 (manual cap)
- Output length: 1024
- Grounding with Google Search: OFF
- System Instructions: role + voice/constraints block (see saved copy)
- User turn format: `Year: / Phase: / Humpback population estimate: / Shipping noise index: / Sea surface temperature anomaly: [value]°C / Anchor event this year: [value or "none"]`

**Field format notes for production:**
- Temp anomaly includes `°C` suffix
- Anchor event label is `Anchor event this year:` (not `Anchor event:`)
- Population is bare integer, no commas in some runs, commas in others — standardize on bare integer for the API
- `"none"` is the literal string for missing anchor events

**Outstanding for wiring (see F3-wire):**
- Move System Instructions into constant
- Build user turn from year payload matching format above exactly
- Preserve `thinkingConfig: { thinkingBudget: 512 }`
- 8s timeout, safety-block fallback
- Curl test boundary years: 1940, 1966, 1967, 2025

---

## F3 — Test outputs log (FINAL, 2026-04-17, AI Studio)

**Config:** Gemini 2.5 Pro, temp 0.9, top-P 0.95, thinking budget 512, output length 1024.

**1952 — The Silencing, no anchor**
Payload: pop 7200 / shipping 0.05 / temp -0.08

> A call is met with a prolonged silence. The water is clear and cold, and a whale's cry travels for miles before it is lost. The sound of a distant engine is a rarity, a faint and intermittent pulse passing through the quiet.

**1966 — The Silencing, anchor: IWC moratorium on commercial humpback hunting**
Payload: pop 5500 / shipping 0.12 / temp -0.03

> The water holds a stillness this year. For the first time, the harpoon boats are gone, their engines absent from the quiet channels. A lone whale passes, its long call traveling out into an ocean that does not answer back.

**1989 — The Return, no anchor**
Payload: pop 18000 / shipping 0.42 / temp 0.18

> Calls now overlap in the warmer currents, one beginning before another ends. The low, constant hum of engines is the medium through which they travel. A whale's voice must now carry through this sound, a thread in a growing weave.

**2005 — The New Ocean, no anchor**
Payload: pop 55000 / shipping 0.72 / temp 0.54

> The water is thick with sound, a constant thrum of engines that travels through the warm currents. Whales move through this dense medium, their calls layering over one another in the close, noisy dark. It is difficult to tell where one voice ends and another begins.

**2022 — The New Ocean, no anchor**
Payload: pop 82000 / shipping 0.95 / temp 1.02

> The water is unusually warm, and the sound is a wall. A whale moves through a field of propeller wash, its call a vibration lost almost as soon as it is made. Voices are close, physical things, felt in the body before they are heard.

**Use these as regression targets.** If the wired API produces outputs meaningfully worse than this set on the same inputs, something in the port drifted.

---

## F3-wire — Gemini endpoint shipped

**Status:** `api/narrate/index.ts` live. Prompt pasted in from AI Studio. Config, system instruction, and user turn all ported. Fallback behavior in place.

**What shipped:**
- Vercel standalone serverless function at `humpback-whale-timeline/api/narrate/index.ts` (Node runtime, fetch-style handler). Replaces the empty `api/narrate.ts` placeholder.
- SDK: `@google/genai@1.50.1` (the current Google Gen AI SDK, not the deprecated `@google/generative-ai`).
- Client: `new GoogleGenAI({ apiKey })`. Call: `ai.models.generateContent({ model, contents, config })`. Response text read via the `response.text` getter (auto-strips thought parts).
- Config ported exactly: model `gemini-2.5-pro`, temp 0.9, topP 0.95, maxOutputTokens 1024, `thinkingConfig.thinkingBudget = 512`.
- `systemInstruction` passed as `[{ text: SYSTEM_PROMPT }]` and `contents` as `[{ role: 'user', parts: [{ text }] }]` — same structured Parts shape AI Studio used, to avoid serialization drift from the regression set.
- Payload: `{ year, phase, population, shippingIndex, tempAnomaly, anchorEvent }` with `phase` typed as union of the three phase names. 400 on malformed JSON or missing/wrong-type fields.
- User turn format carried over byte-for-byte: `Year: / Phase: / Humpback population estimate: / Shipping noise index: / Sea surface temperature anomaly: {n}°C / Anchor event this year: {value or "none"}`.
- 8s timeout via `AbortController` → `config.abortSignal` (SDK supports it natively).
- Fallback string returned with `fallback: true` on: timeout, `promptFeedback.blockReason`, `finishReason === "SAFETY"`, empty/whitespace text, any thrown error, or missing `GEMINI_API_KEY`. Endpoint never returns 500.

**Runtime decision:** Node, not Edge. `@google/genai` pulls `google-auth-library`, `protobufjs`, and `ws` — Node-native. The SDK has a `web` build but it's intended for in-browser use with exposed keys, not Edge serverless. Cold start penalty is negligible for an endpoint called once per year marker.

**Spec-vs-reality divergences resolved:**
- Spec said "Next.js App Router, `app/api/narrate/route.ts`." Project is Vite — not Next.js. Moved file to Vercel standalone serverless convention (`api/narrate/index.ts`). Same deploy URL `/api/narrate`.
- Spec said `topP: 0.95` but AI Studio code did not set `topP` (used model default). Kept 0.95 per spec. Minor regression risk if server default differs — if outputs drift from the logged regression set on the same inputs, try omitting `topP`.
- Spec said test with `npm run dev`. Vite does NOT serve `/api/*`. Use `npx vercel dev` for local endpoint testing, or test against a preview deploy.

**Test call (via `vercel dev` or deployed):**
```
curl -X POST http://localhost:3000/api/narrate \
  -H "Content-Type: application/json" \
  -d '{"year":1952,"phase":"The Silencing","population":7200,"shippingIndex":0.05,"tempAnomaly":-0.08,"anchorEvent":null}'
```

**Env:** `.env.local` already had a working `GEMINI_API_KEY`. Left untouched. Confirmed gitignored via repo-root `*.local` rule — not tracked.

**Not in scope, deferred:** caching, rate limiting, auth. Regression re-run against the full 5-year set once `vercel dev` is up.

---

## Sunday, April 19

### [Fill in as you build]