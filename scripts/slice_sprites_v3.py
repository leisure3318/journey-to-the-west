from PIL import Image, ImageFilter
import os
import numpy as np

os.chdir(os.path.join(os.path.dirname(__file__), ".."))

HEROES_DIR = "assets/sprites/heroes"
OUTPUT_DIR = "assets/sprites/heroes/sliced_v3"
FINAL_SIZE = (128, 128)

os.makedirs(OUTPUT_DIR, exist_ok=True)

DIRECTIONS = ["up", "right", "down", "left"]
FRAMES = ["idle", "walk1", "walk2", "walk3", "walk4"]


def find_grid_lines(img_arr, axis, threshold=245, gap_min=5):
    """
    沿指定轴扫描，找到空白分隔线的位置。
    axis=0: 找水平分隔线（行间隙）→ 返回 y 坐标
    axis=1: 找垂直分隔线（列间隙）→ 返回 x 坐标
    """
    scan_axis = 1 if axis == 0 else 0
    rgb = img_arr[:, :, :3]
    is_white = np.all(rgb > threshold, axis=2)
    white_ratio = np.mean(is_white, axis=scan_axis)

    # 找白色占比 > 90% 的行/列（即空白间隙）
    is_gap = white_ratio > 0.90

    # 找连续空白区间
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

    # 返回每个间隙的中点作为分隔线
    return [(s + e) // 2 for s, e in gaps]


def auto_detect_grid(img):
    """自动检测 4×5 网格的每个单元格边界"""
    arr = np.array(img)
    h, w = arr.shape[:2]

    h_lines = find_grid_lines(arr, axis=0)
    v_lines = find_grid_lines(arr, axis=1)

    print(f"  detected h_lines: {h_lines}")
    print(f"  detected v_lines: {v_lines}")

    # 水平线应该有5条：顶部标题下方 + 4行之间3条 + 底部（可能没有）
    # 需要5条边界来分4行：top, row1/2, row2/3, row3/4, bottom
    # 垂直线应该有6条边界来分5列

    # 过滤：保留最可能的分隔线
    # 水平：需要找到把图分成标题+4行的线
    # 取前5条水平线作为行边界，加上图片底边
    row_bounds = [0] + h_lines + [h]
    col_bounds = [0] + v_lines + [w]

    # 如果检测到的线太多，尝试合并相近的
    row_bounds = merge_close(row_bounds, min_dist=h // 8)
    col_bounds = merge_close(col_bounds, min_dist=w // 8)

    print(f"  row_bounds ({len(row_bounds)}): {row_bounds}")
    print(f"  col_bounds ({len(col_bounds)}): {col_bounds}")

    return row_bounds, col_bounds


def merge_close(lines, min_dist):
    """合并距离过近的线"""
    if not lines:
        return lines
    merged = [lines[0]]
    for l in lines[1:]:
        if l - merged[-1] >= min_dist:
            merged.append(l)
        else:
            merged[-1] = (merged[-1] + l) // 2
    return merged


def flood_fill_label(mask):
    """简易连通区域标记（4-连通），替代 scipy.ndimage.label"""
    h, w = mask.shape
    labels = np.zeros((h, w), dtype=np.int32)
    current_label = 0

    for y in range(h):
        for x in range(w):
            if mask[y, x] and labels[y, x] == 0:
                current_label += 1
                stack = [(y, x)]
                while stack:
                    cy, cx = stack.pop()
                    if cy < 0 or cy >= h or cx < 0 or cx >= w:
                        continue
                    if labels[cy, cx] != 0 or not mask[cy, cx]:
                        continue
                    labels[cy, cx] = current_label
                    stack.extend([(cy-1, cx), (cy+1, cx), (cy, cx-1), (cy, cx+1)])

    return labels, current_label


def remove_label_text(img, margin_ratio=0.18, dark_threshold=100, fragment_ratio=0.08):
    """
    移除帧边缘的标注文字。
    策略：帧的上下左右边距区域内，把所有非白色像素清除为透明。
    角色主体在帧中心，标注文字在边缘，互不重叠。
    """
    arr = np.array(img.convert("RGBA"))
    h, w = arr.shape[:2]

    top = int(h * margin_ratio)
    bottom = int(h * (1 - margin_ratio))
    left = int(w * margin_ratio)
    right = int(w * (1 - margin_ratio))

    # 在边缘区域找深色像素（文字），清除为透明
    result = arr.copy()

    for region in [
        (0, top, 0, w),          # 顶部边距
        (bottom, h, 0, w),       # 底部边距
        (0, h, 0, left),         # 左侧边距
        (0, h, right, w),        # 右侧边距
    ]:
        y1, y2, x1, x2 = region
        zone = result[y1:y2, x1:x2]
        # 找深色像素（灰度 < threshold 且不透明）
        is_dark_text = ((zone[:, :, 0].astype(int) +
                         zone[:, :, 1].astype(int) +
                         zone[:, :, 2].astype(int)) / 3 < dark_threshold) & (zone[:, :, 3] > 10)
        zone[is_dark_text] = [255, 255, 255, 0]

    # 额外处理：清除所有和主体不相连的小碎片（箭头、括号、相邻帧溢出的武器/特效）
    is_content = ((result[:, :, 3] > 10) &
                  ~((result[:, :, 0] > 240) & (result[:, :, 1] > 240) & (result[:, :, 2] > 240)))

    labeled, num_features = flood_fill_label(is_content)
    if num_features > 1:
        sizes = np.array([np.sum(labeled == i) for i in range(1, num_features + 1)])
        main_label = np.argmax(sizes) + 1
        for i in range(1, num_features + 1):
            if i == main_label:
                continue
            region_mask = labeled == i
            region_size = sizes[i - 1]
            if region_size / sizes[main_label - 1] < fragment_ratio:
                result[region_mask] = [255, 255, 255, 0]

    return Image.fromarray(result)


def trim_whitespace(img, threshold=240):
    """裁掉图片周围的白色空白"""
    arr = np.array(img.convert("RGBA"))
    has_content = ((arr[:, :, 3] > 10) &
                   ~((arr[:, :, 0] > threshold) &
                     (arr[:, :, 1] > threshold) &
                     (arr[:, :, 2] > threshold)))

    rows = np.any(has_content, axis=1)
    cols = np.any(has_content, axis=0)

    if not rows.any():
        return img

    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]

    return img.crop((cmin, rmin, cmax + 1, rmax + 1))


def place_centered(trimmed, target_size):
    """居中放置，底部对齐"""
    tw, th = target_size
    iw, ih = trimmed.size

    max_w = int(tw * 0.9)
    max_h = int(th * 0.9)
    scale = min(max_w / iw, max_h / ih)

    new_w = int(iw * scale)
    new_h = int(ih * scale)
    resized = trimmed.resize((new_w, new_h), Image.LANCZOS)

    canvas = Image.new("RGBA", target_size, (255, 255, 255, 0))
    x = (tw - new_w) // 2
    y = th - new_h - int(th * 0.05)
    canvas.paste(resized, (x, y), resized if resized.mode == "RGBA" else None)

    return canvas


def assemble_sheet(frames_dict, char_name):
    """拼成标准 sprite sheet"""
    cols = len(FRAMES)
    rows = len(DIRECTIONS)
    sw = FINAL_SIZE[0] * cols
    sh = FINAL_SIZE[1] * rows
    sheet = Image.new("RGBA", (sw, sh), (255, 255, 255, 0))

    for r, direction in enumerate(DIRECTIONS):
        for c, frame in enumerate(FRAMES):
            key = f"{direction}_{frame}"
            if key in frames_dict:
                sheet.paste(frames_dict[key], (c * FINAL_SIZE[0], r * FINAL_SIZE[1]))

    out_path = os.path.join(OUTPUT_DIR, f"{char_name}_sheet.png")
    sheet.save(out_path)
    print(f"  sheet → {out_path} ({sw}×{sh})")


SPRITES = ["tangseng_sprite.png", "wukong_sprite.png", "bajie_sprite.png", "wujing_sprite.png", "bailongma_sprite.png"]

for filename in SPRITES:
    name = filename.replace("_sprite.png", "")
    img = Image.open(os.path.join(HEROES_DIR, filename)).convert("RGBA")
    w, h = img.size
    print(f"\n{'='*40}")
    print(f"{name}: {w}×{h}")

    row_bounds, col_bounds = auto_detect_grid(img)

    # 我们需要: 跳过标题区域, 取4行×5列
    # row_bounds 中第一个有效行的起点（跳过顶部标注区）
    # col_bounds 中第一个有效列的起点（跳过左侧标注区）

    # 策略：取最后5个列边界（跳过左侧标注列），最后5个行边界（跳过顶部标注行）
    # 需要至少5行边界(4个区间)和6列边界(5个区间)

    if len(row_bounds) < 5:
        print(f"  WARNING: only {len(row_bounds)} row bounds, need 5. Padding with estimates.")
        while len(row_bounds) < 5:
            row_bounds.append(row_bounds[-1] + (h - row_bounds[-1]) // (5 - len(row_bounds) + 1))

    if len(col_bounds) < 6:
        print(f"  WARNING: only {len(col_bounds)} col bounds, need 6. Padding with estimates.")
        while len(col_bounds) < 6:
            col_bounds.append(col_bounds[-1] + (w - col_bounds[-1]) // (6 - len(col_bounds) + 1))

    # 取后5个行边界（4行内容）和后6个列边界（5列内容）
    r_bounds = row_bounds[-(4+1):]
    c_bounds = col_bounds[-(5+1):]

    print(f"  using rows: {r_bounds}")
    print(f"  using cols: {c_bounds}")

    char_dir = os.path.join(OUTPUT_DIR, name)
    os.makedirs(char_dir, exist_ok=True)

    frames_dict = {}
    OVERLAP_MAP = {"bailongma": 0.25}
    FRAGMENT_MAP = {"bailongma": 0.18}
    overlap = OVERLAP_MAP.get(name, 0.15)
    frag_ratio = FRAGMENT_MAP.get(name, 0.08)

    for row_idx in range(4):
        for col_idx in range(5):
            y1 = r_bounds[row_idx]
            y2 = r_bounds[row_idx + 1]
            x1 = c_bounds[col_idx]
            x2 = c_bounds[col_idx + 1]

            cell_h = y2 - y1
            cell_w = x2 - x1
            pad_y = int(cell_h * overlap)
            pad_x = int(cell_w * overlap)

            ey1 = max(0, y1 - pad_y)
            ey2 = min(h, y2 + pad_y)
            ex1 = max(0, x1 - pad_x)
            ex2 = min(w, x2 + pad_x)

            cell = img.crop((ex1, ey1, ex2, ey2))
            cleaned = remove_label_text(cell, fragment_ratio=frag_ratio)
            trimmed = trim_whitespace(cleaned)
            final = place_centered(trimmed, FINAL_SIZE)

            direction = DIRECTIONS[row_idx]
            frame = FRAMES[col_idx]
            key = f"{direction}_{frame}"
            frames_dict[key] = final
            final.save(os.path.join(char_dir, f"{key}.png"))

    # 坏帧替换表：用相邻好帧覆盖源图生成不一致的帧
    BAD_FRAMES = {
        "tangseng": {"up_walk2": "up_walk1"},
        "bailongma": {"up_idle": "up_walk1", "down_idle": "down_walk1"},
    }
    if name in BAD_FRAMES:
        for bad, good in BAD_FRAMES[name].items():
            frames_dict[bad] = frames_dict[good]
            frames_dict[bad].save(os.path.join(char_dir, f"{bad}.png"))
            print(f"  fix: {bad} ← {good}")

    print(f"  saved {len(frames_dict)} frames → {char_dir}/")
    assemble_sheet(frames_dict, name)

print("\n--- Done ---")
