import os
import numpy as np
import soundfile as sf
import librosa

SOURCE = "./whale_source.wav"
LABELS_IN = "./whale_labels.txt"
OUT_DIR = "./public/audio"
TARGET_SR = 48000
FADE_IN_MS = 200
FADE_OUT_MS = 300
PEAK_DB = -3.0

clips = []
with open(LABELS_IN, encoding="utf-8") as f:
    for line in f:
        parts = line.strip().split("\t")
        if len(parts) >= 2:
            clips.append((float(parts[0]), float(parts[1])))

os.makedirs(OUT_DIR, exist_ok=True)
y, sr = librosa.load(SOURCE, sr=TARGET_SR, mono=True)
peak_target = 10 ** (PEAK_DB / 20)

print(f"Loaded {len(y)/sr:.1f}s @ {sr} Hz, exporting {len(clips)} clips to {OUT_DIR}\n")
print(f"{'file':<20} {'dur (s)':>8} {'peak (dB)':>10}")

for i, (start, end) in enumerate(clips, 1):
    clip = y[int(start * sr):int(end * sr)].copy()

    fade_in = int(FADE_IN_MS * sr / 1000)
    fade_out = int(FADE_OUT_MS * sr / 1000)
    clip[:fade_in] *= np.linspace(0.0, 1.0, fade_in)
    clip[-fade_out:] *= np.linspace(1.0, 0.0, fade_out)

    peak = np.max(np.abs(clip))
    if peak > 0:
        clip *= peak_target / peak

    name = f"humpback-{i}.wav"
    path = os.path.join(OUT_DIR, name)
    sf.write(path, clip, sr, subtype="PCM_16")

    final_peak_db = 20 * np.log10(np.max(np.abs(clip)) + 1e-12)
    print(f"{name:<20} {len(clip)/sr:>8.2f} {final_peak_db:>10.2f}")

print(f"\nDone. {len(clips)} files in {OUT_DIR}")
