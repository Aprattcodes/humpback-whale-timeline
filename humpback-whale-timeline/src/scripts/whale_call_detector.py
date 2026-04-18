import librosa
import numpy as np

SOURCE = "./whale_source.wav"
LABELS_OUT = "./whale_labels.txt"
TOP_N = 15
MIN_DURATION = 8.0
MIN_GAP = 2.0
SILENCE_DB = 20.0
HOP = 512

y, sr = librosa.load(SOURCE, sr=None, mono=True)
print(f"Loaded {len(y)/sr:.1f}s of audio at {sr} Hz")

intervals = librosa.effects.split(y, top_db=SILENCE_DB, frame_length=2048, hop_length=HOP)
raw_durs = [(e - s) / sr for s, e in intervals]
print(f"\nRaw intervals from effects.split (top_db={SILENCE_DB}): {len(intervals)}")
if raw_durs:
    bins = [0, 1, 2, 5, 10, 30, 60, 300, 1e9]
    labels = ["<1s", "1-2s", "2-5s", "5-10s", "10-30s", "30-60s", "1-5m", ">5m"]
    counts = [sum(1 for d in raw_durs if bins[i] <= d < bins[i+1]) for i in range(len(labels))]
    print("  duration histogram:", ", ".join(f"{l}:{c}" for l, c in zip(labels, counts) if c))
    print(f"  total signal: {sum(raw_durs):.1f}s ({100*sum(raw_durs)/(len(y)/sr):.1f}% of file)")

merged = []
for start, end in intervals:
    if merged and (start - merged[-1][1]) / sr < MIN_GAP:
        merged[-1] = (merged[-1][0], end)
    else:
        merged.append((start, end))
print(f"After merging gaps <{MIN_GAP}s: {len(merged)} regions")

regions = [(s, e) for s, e in merged if (e - s) / sr >= MIN_DURATION]
print(f"After dropping regions <{MIN_DURATION}s: {len(regions)} regions\n")

scored = []
for start, end in regions:
    segment = y[start:end]
    rms = float(np.mean(librosa.feature.rms(y=segment, hop_length=HOP)))
    flatness = float(np.mean(librosa.feature.spectral_flatness(y=segment, hop_length=HOP)))
    rms_db = 20 * np.log10(rms + 1e-10)
    score = rms_db - 30.0 * flatness
    scored.append((start / sr, end / sr, score))

scored.sort(key=lambda r: r[2], reverse=True)
top = scored[:TOP_N]

print(f"Showing top {len(top)} of {len(regions)} candidates:\n")
print(f"{'#':>3}  {'start (s)':>10}  {'end (s)':>10}  {'dur (s)':>8}  {'score':>8}")
for i, (s, e, score) in enumerate(top, 1):
    print(f"{i:>3}  {s:>10.2f}  {e:>10.2f}  {e-s:>8.2f}  {score:>8.2f}")

with open(LABELS_OUT, "w", encoding="utf-8") as f:
    for i, (s, e, score) in enumerate(top, 1):
        f.write(f"{s:.6f}\t{e:.6f}\tcall_{i:02d} (score={score:.2f})\n")

print(f"\nWrote {len(top)} Audacity labels to {LABELS_OUT}")
print("Import in Audacity via: File -> Import -> Labels...")

candidates = top
