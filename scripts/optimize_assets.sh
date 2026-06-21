#!/bin/bash
# Optimize game assets: resize PNGs to appropriate sizes for game use
# Originals are preserved — this creates optimized versions in-place
# (git can revert if needed)

set -e
ASSETS="/Users/leisure/Code/github/westward-survivors/assets"

resize() {
  local file="$1" maxdim="$2"
  local w=$(sips --getProperty pixelWidth "$file" 2>/dev/null | awk '/pixelWidth/{print $2}')
  local h=$(sips --getProperty pixelHeight "$file" 2>/dev/null | awk '/pixelHeight/{print $2}')
  if [ "$w" -le "$maxdim" ] && [ "$h" -le "$maxdim" ]; then return; fi
  if [ "$w" -ge "$h" ]; then
    sips --resampleWidth "$maxdim" "$file" --out "$file" >/dev/null 2>&1
  else
    sips --resampleHeight "$maxdim" "$file" --out "$file" >/dev/null 2>&1
  fi
}

echo "=== Skill icons (display 48px → resize to 128px) ==="
for f in "$ASSETS"/skills/icons/*.png; do
  resize "$f" 128
  echo "  $(basename "$f")"
done

echo "=== Item icons (display 48px → resize to 128px) ==="
for f in "$ASSETS"/skills/items/*.png; do
  resize "$f" 128
  echo "  $(basename "$f")"
done

echo "=== VFX (display 60-250px → resize to 256px) ==="
for f in "$ASSETS"/skills/vfx/*.png; do
  resize "$f" 256
  echo "  $(basename "$f")"
done

echo "=== Common enemies (display ~50px → resize to 192px) ==="
for f in "$ASSETS"/sprites/enemies/common/*.png; do
  resize "$f" 192
  echo "  $(basename "$f")"
done

echo "=== Boss enemies (display ~180px → resize to 384px) ==="
for f in "$ASSETS"/sprites/enemies/bosses/*.png; do
  resize "$f" 384
  echo "  $(basename "$f")"
done

echo "=== Portraits (not loaded in game, skip) ==="

echo "=== Menu bg (display 800x600 → resize to 960) ==="
resize "$ASSETS/menu_bg.png" 960
echo "  menu_bg.png"

echo "=== Cutscenes (display 800x600 → resize to 960) ==="
for f in "$ASSETS"/cutscenes/*.png; do
  resize "$f" 960
  echo "  $(basename "$f")"
done

echo ""
echo "=== Done! Checking new total size ==="
du -sh "$ASSETS"/skills/ "$ASSETS"/sprites/enemies/ "$ASSETS"/menu_bg.png "$ASSETS"/cutscenes/
