"""
将 generate_boss_sprites.py 生成的原始 sprite sheet 切割为标准格式。
输入: assets/sprites/enemies/bosses/sheets/{key}_sheet_raw.png (1024×1024, 4×5 网格)
输出: assets/sprites/enemies/bosses/sheets/{key}_sheet.png (1280×1024, 4行×5列, 256×256/帧)

用法:
  python scripts/slice_boss_sprites.py                # 切所有
  python scripts/slice_boss_sprites.py black_bear      # 只切黑熊精
"""

from PIL import Image
import numpy as np
import os
import sys
import glob

os.chdir(os.path.join(os.path.dirname(__file__), ".."))

INPUT_DIR = "assets/sprites/enemies/bosses/sheets"
FRAME_SIZE = (256, 256)
ROWS, COLS = 4, 5


def find_grid_lines(img_arr, axis, threshold=245, gap_min=3):
    scan_axis = 1 if axis == 0 else 0
    rgb = img_arr[:, :, :3]
    is_white = np.all(rgb > threshold, axis=2)
    white_ratio = np.mean(is_white, axis=scan_axis)
    is_gap = white_ratio > 0.85

    gaps = []
    in_gap = False
    start = 0
    for i, g in enumerate(is_gap):
        if g and not in_gap:
            start = i
            in_gap = True
        elif not g and in_gap:
            if i - start >= gap_min:
                gaps.append((start, i))
            in_gap = False
    if in_gap and len(is_gap) - start >= gap_min:
        gaps.append((start, len(is_gap)))

    return [(s + e) // 2 for s, e in gaps]


def extract_cells(img):
    arr = np.array(img)
    h, w = arr.shape[:2]

    h_lines = find_grid_lines(arr, axis=0)
    v_lines = find_grid_lines(arr, axis=1)

    row_bounds = []
    y_points = [0] + h_lines + [h]
    for i in range(len(y_points) - 1):
        row_bounds.append((y_points[i], y_points[i + 1]))

    col_bounds = []
    x_points = [0] + v_lines + [w]
    for i in range(len(x_points) - 1):
        col_bounds.append((x_points[i], x_points[i + 1]))

    if len(row_bounds) < ROWS:
        cell_h = h // ROWS
        row_bounds = [(i * cell_h, (i + 1) * cell_h) for i in range(ROWS)]
    if len(col_bounds) < COLS:
        cell_w = w // COLS
        col_bounds = [(i * cell_w, (i + 1) * cell_w) for i in range(COLS)]

    row_bounds = row_bounds[:ROWS]
    col_bounds = col_bounds[:COLS]

    cells = []
    for r in range(ROWS):
        for c in range(COLS):
            y1, y2 = row_bounds[r]
            x1, x2 = col_bounds[c]
            cell = img.crop((x1, y1, x2, y2))
            cell = cell.resize(FRAME_SIZE, Image.LANCZOS)
            cells.append(cell)

    return cells


def slice_boss(key):
    raw_path = os.path.join(INPUT_DIR, f"{key}_sheet_raw.png")
    out_path = os.path.join(INPUT_DIR, f"{key}_sheet.png")

    if not os.path.exists(raw_path):
        print(f"  SKIP (not found): {raw_path}")
        return False

    if os.path.exists(out_path):
        print(f"  SKIP (exists): {out_path}")
        return True

    print(f"  Slicing: {key}")
    img = Image.open(raw_path).convert("RGBA")
    cells = extract_cells(img)

    if len(cells) != ROWS * COLS:
        print(f"  ERROR: expected {ROWS * COLS} cells, got {len(cells)}")
        return False

    sheet_w = COLS * FRAME_SIZE[0]
    sheet_h = ROWS * FRAME_SIZE[1]
    sheet = Image.new("RGBA", (sheet_w, sheet_h), (0, 0, 0, 0))

    for i, cell in enumerate(cells):
        r = i // COLS
        c = i % COLS
        sheet.paste(cell, (c * FRAME_SIZE[0], r * FRAME_SIZE[1]))

    sheet.save(out_path)
    size_kb = os.path.getsize(out_path) / 1024
    print(f"  OK → {out_path} ({size_kb:.0f}KB)")
    return True


if __name__ == "__main__":
    if len(sys.argv) > 1:
        for key in sys.argv[1:]:
            slice_boss(key)
    else:
        raws = glob.glob(os.path.join(INPUT_DIR, "*_sheet_raw.png"))
        total = len(raws)
        done = 0
        for path in raws:
            key = os.path.basename(path).replace("_sheet_raw.png", "")
            if slice_boss(key):
                done += 1
        print(f"\nDone: {done}/{total}")
