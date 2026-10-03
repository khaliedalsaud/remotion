#!/usr/bin/env bash
# Render several frames of the main composition from one bundle, then tile
# them into a contact sheet.
#   scripts/frames.sh <name> <frame> [frame...]
# Bundles into .bundle-<name>, writes out/<name>-<frame>.png and out/<name>-sheet.png
set -euo pipefail
cd "$(dirname "$0")/.."
name="$1"; shift
npx remotion bundle --out-dir=".bundle-$name" >/dev/null 2>&1
files=()
for f in "$@"; do
	npx remotion still ".bundle-$name" MissionAcademyIntro "out/$name-$f.png" --frame="$f" \
		--props='{"captions":true,"sfx":false}' >/dev/null 2>&1 || echo "frame $f failed"
	files+=("out/$name-$f.png")
done
python3 scripts/contact.py "out/$name-sheet.png" "${files[@]}"
echo "out/$name-sheet.png"
