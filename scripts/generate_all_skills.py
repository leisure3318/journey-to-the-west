import requests
import base64
import os
import time

os.chdir(os.path.join(os.path.dirname(__file__), ".."))

BASE_URL = os.environ.get("IMAGE_API_BASE", "https://api.openai.com/v1")
API_KEY = os.environ.get("OPENAI_API_KEY", "")
BASE_DIR = "assets/skills"


def generate_image(prompt, output_path, size="1024x1024"):
    if os.path.exists(output_path):
        print(f"  SKIP (exists): {output_path}")
        return True

    print(f"  Generating: {output_path}")
    try:
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
            timeout=120,
        )
    except Exception as e:
        print(f"  ERROR: {e}")
        return False

    if resp.status_code != 200:
        print(f"  ERROR {resp.status_code}: {resp.text[:200]}")
        return False

    data = resp.json()
    if "data" in data and len(data["data"]) > 0:
        item = data["data"][0]
        if "b64_json" in item:
            img_bytes = base64.b64decode(item["b64_json"])
        elif "url" in item:
            img_bytes = requests.get(item["url"], timeout=60).content
        else:
            print(f"  ERROR: unexpected format: {list(item.keys())}")
            return False
    else:
        print(f"  ERROR: unexpected response")
        return False

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "wb") as f:
        f.write(img_bytes)
    print(f"  OK ({len(img_bytes)//1024}KB)")
    return True


# ============================================================
# VFX 特效 (512x512 → 用 1024x1024 生成，质量更好)
# ============================================================
VFX = [
    ("wukong_staff_sweep.png",
     "Top-down 2D game VFX sprite, golden staff sweep arc effect. A wide 150-degree crescent-shaped golden energy slash trailing behind a swinging iron staff, with sparkling golden particles and motion blur streaks. Transparent background (PNG), cel-shaded style matching chibi game art, warm gold and orange palette, clean outlines, suitable for overlay on game screen."),

    ("wukong_clone.png",
     "Top-down 2D game VFX sprite, monkey hair clone summoning effect. Swirling golden fur particles forming into a translucent golden monkey silhouette, magical sparkles and cloud wisps around it. Transparent background (PNG), cel-shaded style, gold and white palette, clean outlines."),

    ("wukong_transform.png",
     "Top-down 2D game VFX sprite, shapeshifting transformation burst effect. A radial explosion of golden cloud smoke with swirling symbols and animal silhouettes (bird, bee, dragon, ape) fading in and out. Transparent background (PNG), cel-shaded style, vibrant gold with rainbow shimmer accents, clean outlines."),

    ("wukong_fireeyes.png",
     "Top-down 2D game VFX sprite, burning golden eye scan effect. Two piercing golden fire-eye beams shooting forward in a V-shape, with flame particles and a circular detection pulse ring expanding outward. Transparent background (PNG), cel-shaded style, intense gold and red fire palette, clean outlines."),

    ("wukong_evo_dasheng.png",
     "Top-down 2D game VFX sprite, Great Sage Equal to Heaven ultimate effect. A massive golden iron staff expanding and shrinking rapidly, leaving afterimages in a full 360-degree spin, surrounded by golden cloud explosion and celestial Chinese characters glowing in the air. Transparent background (PNG), cel-shaded style, epic gold and crimson palette, clean outlines."),

    ("bajie_rake_slam.png",
     "Top-down 2D game VFX sprite, iron rake ground slam shockwave. A circular crack pattern on the ground radiating outward from a central impact point, with brown earth chunks flying up and dust cloud ring. Transparent background (PNG), cel-shaded style, earth brown and grey palette, clean outlines."),

    ("bajie_charge.png",
     "Top-down 2D game VFX sprite, pig headbutt charge trail effect. A horizontal streak of dust and wind pressure with a snout-shaped shockwave at the front, muddy ground trail behind. Transparent background (PNG), cel-shaded style, brown and tan earth tones, clean outlines."),

    ("bajie_marshal.png",
     "Top-down 2D game VFX sprite, celestial marshal awakening aura. A vertical pillar of blue-white celestial light with ancient Chinese armor silhouette forming within, surrounded by swirling star particles and heavenly cloud wisps. Transparent background (PNG), cel-shaded style, celestial blue and silver palette, clean outlines."),

    ("bajie_evo_tsunami.png",
     "Top-down 2D game VFX sprite, Heavenly River tsunami wave effect. A massive circular water wave expanding outward from center, with churning foam, water droplets, and a giant spectral iron rake riding the wave crest. Transparent background (PNG), cel-shaded style, deep blue and white water palette, clean outlines."),

    ("wujing_staff_throw.png",
     "Top-down 2D game VFX sprite, crescent-moon spade projectile trail. A spinning crescent blade flying forward with a silver-blue energy trail, sand particles swirling behind it. Transparent background (PNG), cel-shaded style, cool silver-blue and sand palette, clean outlines."),

    ("wujing_sand_trap.png",
     "Top-down 2D game VFX sprite, quicksand trap zone on ground. A circular area of swirling sand with a dark vortex center pulling inward, sand grains spiraling, subtle skull shapes visible in the sand. Transparent background (PNG), cel-shaded style, desert tan and dark brown palette, clean outlines."),

    ("wujing_shield.png",
     "Top-down 2D game VFX sprite, scripture scroll barrier shield. A circular protective dome made of floating Buddhist scripture scrolls orbiting around a central point, with golden Sanskrit characters glowing on the scrolls, faint blue energy connecting them. Transparent background (PNG), cel-shaded style, parchment gold and blue energy palette, clean outlines."),

    ("wujing_evo_general.png",
     "Top-down 2D game VFX sprite, Curtain-Raising General ultimate effect. Nine glowing skulls orbiting in a wide circle, each skull shooting a blue-silver homing beam toward different targets, sand storm swirling around the formation. Transparent background (PNG), cel-shaded style, eerie blue-silver and bone-white palette, clean outlines."),

    # tangseng_chant_aura 已生成，跳过
    ("tangseng_headband_spell.png",
     "Top-down 2D game VFX sprite, golden headband tightening spell effect. A glowing golden ring/halo constricting with visible pressure waves, red pain sparks radiating from it, ancient Buddhist seal characters swirling around the ring. Transparent background (PNG), cel-shaded style, gold and angry red palette, clean outlines."),

    ("tangseng_mercy_purify.png",
     "Top-down 2D game VFX sprite, great compassion purification wave. A massive expanding ring of pure white-gold holy light with lotus flower petals scattering outward, Buddhist swastika symbol at center radiating peace, all darkness dissolving at the wave front. Transparent background (PNG), cel-shaded style, pure white and gold with lotus pink accents, clean outlines."),

    ("tangseng_cicada_shield.png",
     "Top-down 2D game VFX sprite, golden cicada death-prevention trigger. A translucent golden cicada shell forming around a central point, cracking with brilliant light beams shooting through the cracks, a brief moment of invincibility visualized as a golden rebirth cocoon. Transparent background (PNG), cel-shaded style, radiant gold and divine white palette, clean outlines."),

    ("tangseng_evo_buddha.png",
     "Top-down 2D game VFX sprite, Buddha's Golden Body ultimate aura. A full-screen golden mandala pattern with concentric rings of Sanskrit text, lotus platforms floating at cardinal points, serene golden light filling everything, a giant translucent Buddha palm print visible in the background. Transparent background (PNG), cel-shaded style, divine gold and lotus pink palette, clean outlines."),

    ("bailongma_frost_trail.png",
     "Top-down 2D game VFX sprite, ice dragon breath ground trail. A path of frost and ice crystals on the ground with faint blue mist rising, small snowflake particles, the trail has a flowing water-like shimmer. Transparent background (PNG), cel-shaded style, icy blue and white palette, clean outlines."),

    ("bailongma_evo_dragon.png",
     "Top-down 2D game VFX sprite, White Dragon Prince transformation burst. An explosion of ice-water energy with a coiling Eastern dragon silhouette emerging from white mist, crystalline ice shards and water droplets flying outward, a glowing dragon pearl at the center. Transparent background (PNG), cel-shaded style, ethereal white-blue and silver palette, clean outlines."),
]

# ============================================================
# 法器图标
# ============================================================
ITEM_PREFIX = "2D game item icon, {name} from Journey to the West. {desc}. Centered on transparent background, detailed but clean cel-shaded style, golden border frame with subtle Buddhist motif, warm lighting, suitable for game UI inventory slot. 256x256 pixels."

ITEMS = [
    ("jinboyu.png", "Golden Buddhist Alms Bowl", "A golden Buddhist alms bowl glowing with warm light, Sanskrit characters orbiting"),
    ("jialan_jiasha.png", "Brocade Kasaya Robe", "A magnificent folded crimson-gold kasaya robe radiating protective energy"),
    ("jiuhuan_xizhang.png", "Nine-Ring Pewter Staff", "A pewter monk staff with 9 jingling rings at top, holy light emanating"),
    ("tongguan_wendie.png", "Imperial Travel Passport", "An ancient imperial travel scroll/passport with red seal stamps, golden glow"),
    # renshen_guo 已生成
    ("pantao.png", "Celestial Peach", "A large celestial peach with pink-golden glow, heavenly cloud wisps around it"),
    ("zhaoyao_jing.png", "Demon-Revealing Mirror", "An ornate bronze mirror with swirling demon-revealing energy in reflection"),
    ("bajiao_shan.png", "Banana Leaf Fan", "A large palm-leaf fan with wind energy swirls, green with golden trim"),
    ("ruyi_jingu.png", "Golden Headband of Power", "A golden circlet/headband crackling with power, size-changing visual"),
    ("tianpeng_lingpai.png", "Marshal Tianpeng Token", "A celestial jade military token with Marshal Tianpeng inscription, blue glow"),
    ("jiukulou_chuan.png", "Nine Skull Necklace", "A necklace of 9 small bleached skulls strung together, eerie blue glow"),
    ("zijin_hulu.png", "Purple-Gold Gourd", "A purple-gold gourd with red stopper, swirling suction vortex at opening"),
    ("dinghai_shenzhu.png", "Sea-Calming Pearl", "A luminous ice-blue pearl floating with frost mist and water energy"),
    ("bihuo_zhao.png", "Fire-Repelling Shield", "A translucent dome shield with fire-repelling runes, cool blue barrier"),
    ("yinshen_mao.png", "Invisibility Cap", "A simple cloth cap that is half-transparent/fading, with stealth shimmer"),
]

# ============================================================
# 技能图标
# ============================================================
ICON_PREFIX = "2D game skill icon, {desc}. Circular icon with dark border ring, dynamic composition, cel-shaded style matching Journey to the West fantasy theme. Transparent background, 256x256 pixels."

ICONS = [
    ("wukong_sweep.png", "Golden staff mid-sweep with arc slash energy trail"),
    ("wukong_clone.png", "Three golden monkey silhouettes overlapping, fur particles"),
    ("wukong_transform.png", "Swirling cloud with animal shapes morphing, golden mist"),
    ("wukong_fireeyes.png", "Close-up of fierce golden burning eye with fire pupil"),
    ("bajie_slam.png", "Iron rake slamming ground with shockwave rings"),
    ("bajie_charge.png", "Pig snout with charge wind streaks, dust cloud"),
    ("bajie_marshal.png", "Celestial marshal armor silhouette in blue light"),
    ("bajie_appetite.png", "Round belly with healing green glow and food icons"),
    ("wujing_throw.png", "Crescent-moon spade spinning with silver trail"),
    ("wujing_sandtrap.png", "Quicksand vortex spiral from above, dark center"),
    ("wujing_shield.png", "Floating scripture scrolls forming a shield circle"),
    ("wujing_domain.png", "Expanding water ripple ring with sand particles"),
    ("tangseng_chant.png", "Soft golden halo with floating Sanskrit text"),
    ("tangseng_headband.png", "Tightening golden headband ring with pain sparks"),
    ("tangseng_mercy.png", "Lotus bloom with expanding purification light ring"),
    ("tangseng_cicada.png", "Golden cicada shell with divine protection glow"),
    ("bailongma_speed.png", "White horse hooves with speed streak lines"),
    ("bailongma_pearl.png", "Glowing pearl with XP orbs being attracted inward"),
    ("bailongma_trail.png", "Ice-frost trail with snowflake particles"),
]


def main():
    total = len(VFX) + len(ITEMS) + len(ICONS)
    done = 0
    failed = 0

    print(f"=== 批量生成技能图片 ({total} 张) ===\n")

    # VFX
    print(f"--- VFX 特效 ({len(VFX)} 张) ---")
    for filename, prompt in VFX:
        path = os.path.join(BASE_DIR, "vfx", filename)
        ok = generate_image(prompt, path)
        done += 1
        if not ok:
            failed += 1
        print(f"  [{done}/{total}]")
        time.sleep(1)

    # 法器
    print(f"\n--- 法器图标 ({len(ITEMS)} 张) ---")
    for filename, name, desc in ITEMS:
        prompt = ITEM_PREFIX.format(name=name, desc=desc)
        path = os.path.join(BASE_DIR, "items", filename)
        ok = generate_image(prompt, path)
        done += 1
        if not ok:
            failed += 1
        print(f"  [{done}/{total}]")
        time.sleep(1)

    # 技能图标
    print(f"\n--- 技能图标 ({len(ICONS)} 张) ---")
    for filename, desc in ICONS:
        prompt = ICON_PREFIX.format(desc=desc)
        path = os.path.join(BASE_DIR, "icons", filename)
        ok = generate_image(prompt, path)
        done += 1
        if not ok:
            failed += 1
        print(f"  [{done}/{total}]")
        time.sleep(1)

    print(f"\n=== 完成: {done - failed}/{total} 成功, {failed} 失败 ===")


if __name__ == "__main__":
    main()
