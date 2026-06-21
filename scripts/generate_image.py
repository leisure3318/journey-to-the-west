import requests
import base64
import os
import sys

os.chdir(os.path.join(os.path.dirname(__file__), ".."))

BASE_URL = os.environ.get("IMAGE_API_BASE", "https://api.openai.com/v1")
API_KEY = os.environ.get("OPENAI_API_KEY", "")

def generate_image(prompt, output_path, size="1024x1024"):
    print(f"Generating: {output_path}")
    print(f"  Size: {size}")
    print(f"  Prompt: {prompt[:80]}...")

    resp = requests.post(
        f"{BASE_URL}/images/generations",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": "gpt-image-2",
            "prompt": prompt,
            "n": 1,
            "size": size,
        },
        timeout=300,
    )

    if resp.status_code != 200:
        print(f"  ERROR {resp.status_code}: {resp.text[:200]}")
        return False

    data = resp.json()

    # 尝试不同的响应格式
    if "data" in data and len(data["data"]) > 0:
        item = data["data"][0]
        if "b64_json" in item:
            img_bytes = base64.b64decode(item["b64_json"])
        elif "url" in item:
            img_bytes = requests.get(item["url"], timeout=60).content
        else:
            print(f"  ERROR: unexpected response format: {list(item.keys())}")
            return False
    else:
        print(f"  ERROR: unexpected response: {str(data)[:200]}")
        return False

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "wb") as f:
        f.write(img_bytes)

    size_kb = len(img_bytes) / 1024
    print(f"  OK → {output_path} ({size_kb:.0f}KB)")
    return True


if __name__ == "__main__":
    # 测试生成2张图

    # 1. 法器图标：人参果
    generate_image(
        prompt=(
            "2D game item icon, Ginseng Fruit (人参果) from Journey to the West. "
            "A luminous baby-shaped fruit on a small branch, glowing with life energy, pink. "
            "Centered on transparent background, detailed but clean cel-shaded style, "
            "golden border frame with subtle Buddhist motif, warm lighting, suitable "
            "for game UI inventory slot. 256x256 pixels."
        ),
        output_path="assets/skills/items/renshen_guo.png",
        size="1024x1024",
    )

    # 2. 技能特效：金光念经
    generate_image(
        prompt=(
            "Top-down 2D game VFX sprite, golden Buddhist chanting aura. A soft circular "
            "golden glow with floating Sanskrit characters (Om Mani Padme Hum) slowly "
            "orbiting, gentle light rays emanating outward, peaceful but powerful holy "
            "energy. Transparent background (PNG), cel-shaded style, warm gold and soft "
            "white palette, clean outlines."
        ),
        output_path="assets/skills/vfx/tangseng_chant_aura.png",
        size="1024x1024",
    )
