import sys
import os
import time

sys.path.insert(0, os.path.dirname(__file__))
os.chdir(os.path.join(os.path.dirname(__file__), ".."))

from generate_image import generate_image

REMAINING_CG = [
    {
        "output": "assets/cutscenes/prologue_01_court.png",
        "prompt": (
            "Cinematic game cutscene, Tang Dynasty imperial court. Emperor on golden "
            "dragon throne, young monk Xuanzang kneeling before him holding a travel "
            "scroll. Officials in silk robes on both sides. Grand red pillars, golden "
            "ceiling, incense smoke. Warm golden light. Chinese ink wash meets game "
            "concept art. Rich red and gold palette. 16:9 widescreen."
        ),
    },
    {
        "output": "assets/cutscenes/prologue_04_night.png",
        "prompt": (
            "Cinematic game cutscene, moonlit wilderness night. Monk Xuanzang walking "
            "alone leading a white horse, holding a staff with faint golden glow. Dense "
            "dark forest with glowing eyes in shadows. Crescent moon, starry sky, ground "
            "mist. Fearful but resolute expression. Chinese ink wash meets dark fantasy "
            "game art. Blue-black palette with warm golden light. 16:9 widescreen."
        ),
    },
]

MAX_RETRIES = 3
RETRY_DELAY = 30

if __name__ == "__main__":
    for cg in REMAINING_CG:
        if os.path.exists(cg["output"]):
            print(f"跳过（已存在）: {cg['output']}")
            continue

        for attempt in range(1, MAX_RETRIES + 1):
            print(f"\n{'='*50}")
            print(f"尝试 {attempt}/{MAX_RETRIES}: {cg['output']}")
            print(f"{'='*50}")

            ok = generate_image(cg["prompt"], cg["output"], size="1024x1024")
            if ok:
                print(f"成功！")
                break

            if attempt < MAX_RETRIES:
                wait = RETRY_DELAY * attempt
                print(f"失败，{wait}秒后重试...")
                time.sleep(wait)
            else:
                print(f"全部重试失败: {cg['output']}")

        time.sleep(5)

    print("\n生成完毕。")
