## F3 — Gemini narration prompt (in progress, paused)

**Status:** Prompt drafted and tested in AI Studio against 5 years (1952, 1966, 1989, 2005, 2022). Outputs are structurally within spec (length, no forbidden phrases, stays underwater) but off-register. Paused per block's 30-min critical check. Resume Saturday with fresh ears.

**Setup that worked:**
- Model: Gemini 2.5 Pro
- Temperature: 0.9, Top-P: 0.95
- Thinking budget: 512 (manual cap — Pro can't disable thinking)
- Output length: 1024
- System Instructions: role + voice/constraints
- User turn: per-year data payload
- Grounding with Google Search: OFF

**Issues to fix before wiring:**
1. **Vocabulary collapse.** "Choir" or "chorus" appeared in 3 of 5 outputs. Prompt isn't pushing hard enough on lexical variety. Likely needs an explicit avoid-list: choir, chorus, song (as collective noun), echo, deep, vast, haunting, ancient.
2. **Closing-line moralizing via whale POV.** Forbidden-phrase list catches direct instruction but not "they must sing louder to be heard" / "they must travel farther to find food." Same didactic shape, just laundered through the whales. Need an instruction like: "No closing-line consequences. End on present-tense observation, same register as the opening."
3. **Climate-briefing arc.** All paragraphs follow setting → problem → consequence. Try reframing: "The data is not a problem to be diagnosed. It is the weather of that year."

**Saturday plan:**
1. Re-read the 4 saved outputs cold before touching anything. Confirm tonight's ear was right.
2. Add the three instructions above to System Instructions.
3. Re-run 1989 first (cleanest test — no anchor event, mid-arc).
4. If still off after one iteration, A/B against Gemini 2.5 Flash (faster, cheaper, register may hold given heavily-constrained prompt).
5. Once one model produces 5 acceptable paragraphs, wire into `api/narrate.ts`. Carry over generationConfig exactly, including `thinkingConfig: { thinkingBudget: 512 }`. Set 8s timeout. Handle empty-candidates safety blocks.
6. Curl test boundary years: 1940, 1966→1967 (phase boundary), 2025.
7. Commit and push.

**Saved artifacts:**
- Current System Instructions: [paste path or inline]
- 4 test outputs (1952, 1989, 2005, 2022): [paste path or inline]
- 1966 not captured — rate limit hit before re-run with thinking budget enabled

**Open question for production:**
Test data uses inflated/rounded population estimates for legibility across 5 sample points. Replace with real source values before shipping. Decide where source-of-truth lives (JSON in repo? separate data file? endpoint?).

## F3 — Test outputs log (2026-04-17, AI Studio)

**Config:** Gemini 2.5 Pro, temp 0.9, top-P 0.95, thinking budget 512 (manual), output length 1024. System Instructions: role + voice/constraints block. User turn: data payload.

---

**1952 — The Silencing, no anchor event**
Payload: pop 14,000 / shipping 0.18 / temp -0.02

> The ocean is still clear enough for a single song to carry across a basin, but the choir is thinning. More and more, a call is met with a prolonged silence. The hum of propellers is a faint and intermittent pulse in the deep.

Notes: Strongest of the four. "A call is met with a prolonged silence" carries the population data without naming a number. "Choir" is the first instance of the vocabulary problem.

---

**1966 — The Silencing, anchor: IWC ends commercial humpback whaling in N. Pacific**
Payload: pop 5,000 / shipping 0.24 / temp -0.01

> But this year, the hunt ends in the North Pacific, and the deep quiet begins to change its [TRUNCATED]

Notes: Output cut off. First run was before thinking budget was capped — output length budget exhausted by thinking trace. Did not re-run before rate limit. Re-run Saturday with current config.

---

**1989 — The Return, no anchor event**
Payload: pop 12,000 / shipping 0.42 / temp 0.18

> The songs grow more complex, the choruses fuller, as the population slowly recovers its old numbers. But the sea is no longer the clear, quiet medium it once was. A growing engine hum now travels through the water, a constant presence beneath the calls.

Notes: Second instance of "chorus." Arc is setting → problem → consequence. "No longer the clear, quiet medium it once was" is the briefing register the prompt is supposed to prevent.

---

**2005 — The New Ocean, no anchor event**
Payload: pop 35,000 / shipping 0.71 / temp 0.46

> The water is warmer now, a subtle shift in the currents that guide them. Their calls fill the feeding grounds again, a great chorus of returning voices, but the sea is thick with the thrum of engines, and they must sing louder to be heard.

Notes: Third instance of "chorus." First instance of moralizing via whale POV — "they must sing louder to be heard." Same didactic shape as forbidden phrases, laundered through the whales.

---

**2022 — The New Ocean, anchor: North Pacific marine heatwave**
Payload: pop 80,000 / shipping 0.94 / temp 0.89

> Vast patches of the North Pacific grow unnervingly warm, the water still and empty of krill. Though their numbers have returned to the old abundance, the whales find the familiar currents altered, the deep pantries bare. They must travel farther now to find food.

Notes: Second instance of "they must" closing. Uses "vast" (on the avoid-list candidates). Anchor event is acknowledged but the paragraph doesn't really turn on it — reads like another general New Ocean paragraph that mentions warmth.

---

**Cross-output patterns:**
- "Choir/chorus" in 3 of 4 received outputs
- "They must…" closing in 2 of 4
- All four follow setting → problem → consequence arc
- Strongest line across all outputs: "a call is met with a prolonged silence" (1952). Closest to the target register. Use as a north star when judging Saturday's re-runs.

**Update — 1989 re-run with revised prompt:** Successful. Output:
"The calls are more frequent now, filling the spaces between the 
steady thrum of engines. A whale can breach and find another of 
its kind within sight. The water is warmer than the grandmothers 
would have known."

Arc broken (no setting→problem→consequence). Population data 
carried by imagery ("find another within sight"). Temperature 
carried by lineage ("warmer than the grandmothers would have known"). 
None of the avoid-list vocabulary.

Revised prompt is working. Proceeding Saturday with confirmation 
runs (1966, 2005, 2022, 1952) and then wire-in.

**Watch for on confirmation runs:**
- "Grandmothers" repeating (would indicate new vocabulary collapse)
- Shipping noise descriptions staying varied across decades 
  ("steady" good for 1989; different word needed for 2005/2022)
- Anchor event in 1966 being contained by the year rather than 
  reacting to it