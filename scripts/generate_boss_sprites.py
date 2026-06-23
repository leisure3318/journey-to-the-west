"""
批量生成 Boss sprite sheet（4方向 × 5帧 走动动画）
使用 GPT Image 2 API，需要环境变量：
  export OPENAI_API_KEY="your-key"
  export IMAGE_API_BASE="your-base-url"

用法：
  python scripts/generate_boss_sprites.py                # 生成所有
  python scripts/generate_boss_sprites.py black_bear      # 只生成黑熊精
  python scripts/generate_boss_sprites.py --list          # 列出所有Boss
"""

import os
import sys

os.chdir(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, os.path.dirname(__file__))
from generate_image import generate_image

OUTPUT_DIR = "assets/sprites/enemies/bosses/sheets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

BOSS_PROMPTS = {
    "black_bear": {
        "name": "黑熊精",
        "desc": "A massive black bear demon wearing stolen Buddhist kasaya robe, standing upright, muscular dark fur, fierce red eyes, sharp claws",
    },
    "yellow_wind": {
        "name": "黄风大王",
        "desc": "A rat demon king in yellow robes with swirling wind powers, sharp teeth, cunning expression, holding a trident, dusty yellow aura",
    },
    "white_bone": {
        "name": "白骨精",
        "desc": "A skeletal female demon with pale white skin, tattered dark robes, glowing ghostly eyes, bone staff, ethereal mist around her",
    },
    "spider": {
        "name": "蜘蛛精",
        "desc": "A spider demoness with multiple spider legs emerging from back, dark purple silk robes, web patterns, venomous green eyes",
    },
    "gold_horn": {
        "name": "金角大王",
        "desc": "A golden-horned demon king in ornate armor, single large golden horn on forehead, holding a purple-gold gourd, imposing stance",
    },
    "red_boy": {
        "name": "红孩儿",
        "desc": "A child demon with flaming red hair and skin wreathed in fire, red armor, holding a fire-tipped spear, fierce child warrior",
    },
    "bull_demon": {
        "name": "牛魔王",
        "desc": "The Bull Demon King, enormous muscular bull-headed demon in heavy armor, two massive curved horns, wielding a giant iron mace",
    },
    "leopard_spirit": {
        "name": "豹子精",
        "desc": "A leopard demon with spotted fur pattern, agile stance, sharp claws, feline features, wearing light leather armor, fast and deadly",
    },
    "deer_immortal": {
        "name": "鹿力大仙",
        "desc": "A deer-headed Taoist immortal with antlers, wearing Taoist robes, holding a fly whisk, mystical aura, scholarly but sinister",
    },
    "tiger_immortal": {
        "name": "虎力大仙",
        "desc": "A tiger-headed Taoist immortal with striped fur, wearing ornate Taoist robes, muscular, fierce expression, holding a ceremonial sword",
    },
    "scorpion_spirit": {
        "name": "蝎子精",
        "desc": "A scorpion demoness with a large curved stinger tail, dark chitin armor, pincers, glowing purple venom, dangerous beauty",
    },
    "goldfish_king": {
        "name": "金鱼精",
        "desc": "A golden carp demon in flowing blue-gold robes, fish fins as decorations, scales on skin, holding a water pearl, aquatic aura",
    },
    "mouse_spirit": {
        "name": "老鼠精",
        "desc": "A mouse demoness in elegant red robes, mouse ears and tail, small but cunning, holding a magic fan, playful yet dangerous",
    },
    "white_deer": {
        "name": "白鹿精",
        "desc": "A white deer spirit with pure white fur and golden antlers, wearing sage robes, gentle appearance masking dark power",
    },
    "hundred_eye": {
        "name": "百眼魔君",
        "desc": "A centipede demon with multiple glowing eyes across body, dark segmented armor, many legs visible, golden light beams from eyes",
    },
    "yellow_robe": {
        "name": "黄袍怪",
        "desc": "A star deity fallen demon in yellow imperial robes with star patterns, wolf-like features, celestial but corrupted aura",
    },
    "stone_golem": {
        "name": "石魔",
        "desc": "A massive stone golem demon made of grey rock and crystal, moss-covered, glowing rune cracks, heavy and slow but powerful",
    },
    "goat_immortal": {
        "name": "羊力大仙",
        "desc": "A goat-headed Taoist immortal with curling horns, white beard, wearing dark Taoist robes, holding an alchemical gourd",
    },
    "iron_fan": {
        "name": "铁扇公主",
        "desc": "Princess Iron Fan, elegant demoness in flowing red and gold robes, holding a giant banana leaf fan, wind powers, regal bearing",
    },
    "silver_horn": {
        "name": "银角大王",
        "desc": "A silver-horned demon king in dark armor, single silver horn, holding a jade rope, cunning expression, younger brother energy",
    },
    "jade_rabbit": {
        "name": "玉兔精",
        "desc": "The Jade Rabbit spirit with white rabbit ears, wearing celestial maiden robes of pale blue, holding a pestle, moon aura, cute but strong",
    },
    "golden_roc": {
        "name": "大鹏金翅鸟",
        "desc": "The Great Roc bird demon with massive golden wings, eagle-like features, golden feathers, enormous and majestic, divine predator",
    },
    "blue_lion": {
        "name": "青狮精",
        "desc": "A blue-maned lion demon in dark armor, massive fangs, azure fur mane, muscular quadruped stance with some humanoid features",
    },
    "white_elephant": {
        "name": "白象精",
        "desc": "A white elephant demon with long tusks, wearing heavy ornate armor, trunk raised, massive and imposing, grey-white skin",
    },
    "zhen_yuan": {
        "name": "镇元大仙",
        "desc": "The Great Immortal Zhenyuan, elderly sage in pristine white Taoist robes, long white beard, holding a ginseng fruit tree branch, supreme power",
    },
    "rhino_cold": {
        "name": "辟寒大王",
        "desc": "A rhinoceros demon king with icy blue armor, frost aura, single horn glowing with cold energy, heavy build, ice crystals",
    },
    "rhino_dust": {
        "name": "辟尘大王",
        "desc": "A rhinoceros demon king with brown dusty armor, sandstorm aura, horn crackling with earth energy, heavy build, dust clouds",
    },
    "rhino_heat": {
        "name": "辟暑大王",
        "desc": "A rhinoceros demon king with red-hot armor, heat haze aura, horn burning with fire energy, heavy build, magma cracks",
    },
}

PROMPT_TEMPLATE = (
    "Top-down 2D game character sprite sheet, {name} ({desc}) from Journey to the West Chinese mythology. "
    "Strict top-down perspective, camera directly above looking down. "
    "4 rows × 5 columns grid layout on WHITE background with clear gaps between cells. "
    "Row 1: facing DOWN (5 frames: idle, walk1, walk2, walk3, walk4). "
    "Row 2: facing RIGHT (5 frames). "
    "Row 3: facing UP (5 frames). "
    "Row 4: facing LEFT (5 frames). "
    "Chibi/cute stylized proportions (large head, small body), cel-shaded style, "
    "consistent proportions across all 20 frames, exaggerated walk cycle leg movement. "
    "Boss enemy character, slightly larger and more detailed than regular enemies. "
    "Each cell approximately 200×250 pixels within the 1024×1024 total image."
)


def generate_boss(key):
    if key not in BOSS_PROMPTS:
        print(f"Unknown boss: {key}")
        return False

    info = BOSS_PROMPTS[key]
    prompt = PROMPT_TEMPLATE.format(name=info["name"], desc=info["desc"])
    output_path = os.path.join(OUTPUT_DIR, f"{key}_sheet_raw.png")

    if os.path.exists(output_path):
        print(f"  SKIP (exists): {output_path}")
        return True

    return generate_image(prompt, output_path, size="1024x1024")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        if sys.argv[1] == "--list":
            for k, v in BOSS_PROMPTS.items():
                print(f"  {k:20s} → {v['name']}")
            sys.exit(0)

        for key in sys.argv[1:]:
            generate_boss(key)
    else:
        total = len(BOSS_PROMPTS)
        done = 0
        for key in BOSS_PROMPTS:
            if generate_boss(key):
                done += 1
        print(f"\nDone: {done}/{total}")
