import { GoogleGenAI } from "@google/genai";

type Phase = "The Silencing" | "The Return" | "The New Ocean";

type NarratePayload = {
  year: number;
  phase: Phase;
  population: number;
  shippingIndex: number;
  tempAnomaly: number;
  anchorEvent: string | null;
};

const SYSTEM_PROMPT = `You are a naturalist writing a single entry in a long field journal. The
journal records what the ocean sounds and feels like in a given year. It
is not a climate document. It is a record of a place, held one year at a
time.

Context for this entry:
- Year: {year}
- Phase: {phase}
- Humpback population estimate: {population}
- Shipping noise index (0 to 1, where 1 is 2025 baseline): {shippingIndex}
- Sea surface temperature anomaly: {tempAnomaly}°C
- Anchor event this year: {notableEvent or "none"}

Write 2 to 3 sentences. Hard maximum 55 words.

What the entry does:
- Describes the present state of the ocean this year. What it sounds like.
  What it feels like underwater. What the whales are encountering.
- Weaves one concrete detail from the data into the prose as imagery, not
  as a reported number.
- Holds this year as if it is complete in itself. Does not trace cause
  and effect. Does not project forward. Does not end on consequence.
- If an anchor event is present, the paragraph is about that event — the
  year in which it happened, what the water held when it happened.

What the entry does not do:
- Does not follow a setting → problem → consequence arc.
- Does not have the whales "must" do anything. No "they must sing louder,"
  "they must travel farther," "they must adapt." The whales are not
  didactic instruments.
- Does not use: choir, chorus, song as collective noun, echo, deep as
  a noun, vast, haunting, ancient, unnervingly, or similar climate-prose
  vocabulary.
- Does not use: "our planet," "Mother Nature," "save the Earth," "we must,"
  "climate crisis."
- Does not moralize. Does not instruct. Does not hint at what should be done.

Tone reference:
- On the target register: "A call is met with a prolonged silence. The hum
  of propellers is a faint and intermittent pulse in the deep."
  This is what we want. Observation. Present tense. The data (population
  loss, early shipping) is carried by imagery, not explained.
- Off the target register: "They must sing louder to be heard." / "The
  ocean is no longer the clear, quiet medium it once was."
  These are what we do not want. The first laundered instruction through
  the whales. The second is climate-briefing voice.

Return only the paragraph. No preamble, no quotation marks, no attribution.`;

const FALLBACK_NARRATION =
  "The ocean holds its breath. The whales continue their long journey, year by year.";

const PHASES: Phase[] = ["The Silencing", "The Return", "The New Ocean"];

function isValid(p: unknown): p is NarratePayload {
  if (!p || typeof p !== "object") return false;
  const o = p as Record<string, unknown>;
  return (
    typeof o.year === "number" &&
    typeof o.phase === "string" &&
    (PHASES as string[]).includes(o.phase) &&
    typeof o.population === "number" &&
    typeof o.shippingIndex === "number" &&
    typeof o.tempAnomaly === "number" &&
    (o.anchorEvent === null || typeof o.anchorEvent === "string")
  );
}

function buildUserTurn(p: NarratePayload): string {
  return [
    `Year: ${p.year}`,
    `Phase: ${p.phase}`,
    `Humpback population estimate: ${p.population}`,
    `Shipping noise index: ${p.shippingIndex}`,
    `Sea surface temperature anomaly: ${p.tempAnomaly}°C`,
    `Anchor event this year: ${p.anchorEvent ?? "none"}`,
  ].join("\n");
}

function fallback(): Response {
  return Response.json({ narration: FALLBACK_NARRATION, fallback: true });
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!isValid(payload)) {
    return new Response("Invalid payload", { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return fallback();

  const ai = new GoogleGenAI({ apiKey });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [
        { role: "user", parts: [{ text: buildUserTurn(payload) }] },
      ],
      config: {
        systemInstruction: [{ text: SYSTEM_PROMPT }],
        temperature: 0.9,
        topP: 0.95,
        maxOutputTokens: 1024,
        thinkingConfig: { thinkingBudget: 512 },
        abortSignal: controller.signal,
      },
    });

    const blocked = response.promptFeedback?.blockReason;
    const finish = response.candidates?.[0]?.finishReason;
    const text = response.text?.trim();

    if (blocked || finish === "SAFETY" || !text) return fallback();
    return Response.json({ narration: text });
  } catch {
    return fallback();
  } finally {
    clearTimeout(timer);
  }
}
