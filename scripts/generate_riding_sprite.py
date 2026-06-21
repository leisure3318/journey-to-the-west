import sys
import os
import time

sys.path.insert(0, os.path.dirname(__file__))
os.chdir(os.path.join(os.path.dirname(__file__), ".."))

from generate_image import generate_image

OUTPUT = "assets/sprites/heroes/tangseng_riding_sheet.png"
MAX_RETRIES = 3
RETRY_DELAY = 30

PROMPT = (
    "Top-down 2D RPG sprite sheet of a Buddhist monk (Tang Seng) riding a white horse. "
    "Grid layout: 4 rows x 5 columns, each cell 128x128 pixels. "
    "Row 1: facing up/back (idle + 4 walk frames). "
    "Row 2: facing right (idle + 4 walk frames). "
    "Row 3: facing down/front (idle + 4 walk frames). "
    "Row 4: facing left (idle + 4 walk frames). "
    "Monk wears golden-yellow Buddhist robes and a straw hat, sitting on a white horse. "
    "Horse has simple saddle and reins. Walk frames show horse legs in trotting motion. "
    "Chibi/cute pixel art style, bright colors, transparent or solid green background. "
    "Consistent proportions across all 20 frames. Each frame clearly separated in the grid."
)

if __name__ == "__main__":
    if os.path.exists(OUTPUT):
        print(f"已存在: {OUTPUT}")
        sys.exit(0)

    for attempt in range(1, MAX_RETRIES + 1):
        print(f"\n尝试 {attempt}/{MAX_RETRIES}: 生成唐僧骑马 sprite sheet")
        ok = generate_image(PROMPT, OUTPUT, size="1024x1024")
        if ok:
            print("生成成功！")
            print(f"输出: {OUTPUT}")
            print("接下来需要用 slice_sprites_v3.py 切图")
            break
        if attempt < MAX_RETRIES:
            wait = RETRY_DELAY * attempt
            print(f"失败，{wait}秒后重试...")
            time.sleep(wait)
        else:
            print("全部重试失败")
