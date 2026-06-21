import requests
import base64
import os
import time
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed

os.chdir(os.path.join(os.path.dirname(__file__), ".."))

BASE_URL = os.environ.get("IMAGE_API_BASE", "https://api.openai.com/v1")
API_KEY = os.environ.get("OPENAI_API_KEY", "")

ENEMY_STYLE = (
    "ENEMY STYLE ANCHOR: Chibi/cute-but-menacing top-down 2D game enemy sprite, "
    "matching the art style of the hero characters — soft cel-shaded, warm color "
    "palette with darker tones for enemies, clean outlines, large head small body "
    "proportions. Single character centered on transparent background (PNG), "
    "right-facing action pose. "
)

BOSS_STYLE = (
    "BOSS STYLE ANCHOR: Chibi/cute-but-imposing top-down 2D game boss sprite, "
    "matching the art style of the hero characters — soft cel-shaded, warm color "
    "palette, clean outlines, large head proportions but more detailed and "
    "powerful-looking than regular enemies. Single character centered on "
    "transparent background (PNG), dynamic action pose. Larger and more "
    "intimidating than regular mobs. Rich detail and strong visual presence. "
)


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
# 通用小怪 (30张)
# ============================================================
COMMON_ENEMIES = [
    # 冲锋型
    ("bandit.png",
     "A masked bandit/brigand wielding a curved dao sword. Wearing tattered brown leather armor with a black cloth mask, fierce narrowed eyes. Running forward in attack pose with sword raised. Dusty and rough appearance. Dark brown and grey color palette with red sash accent."),

    ("wolf.png",
     "A snarling grey wolf in attack stance. Lean hungry body, bared fangs dripping, glowing yellow eyes, raised hackles. Running/leaping forward pose. Grey fur with darker back, pale underbelly. Faint shadowy aura."),

    ("wolf_demon.png",
     "An anthropomorphic wolf demon standing upright. Wolf head with fierce red eyes, wearing ragged dark blue robes, wielding a rusty iron mace. Muscular build, grey-black fur, fanged snarl. Dark blue and grey color palette with red eye glow accent."),

    ("tiger_demon.png",
     "An anthropomorphic tiger demon warrior. Orange-striped tiger head with fierce expression, wearing battered bronze armor plates, wielding a broad-blade halberd. Powerful stance, tail swishing. Orange, black stripes with bronze armor accents."),

    ("bull_spirit.png",
     "A furious bull demon with glowing red eyes. Massive horns, ring through nose, muscular dark-brown body, hooves crackling with earth energy. Charging forward pose with head lowered. Dark brown and red color palette, earth dust particles around hooves."),

    ("pig_imp.png",
     "A small chubby pig demon minion. Pink round face with small tusks, floppy ears, wearing a simple hemp vest, holding a wooden club. Comically aggressive expression, short stubby legs mid-run. Pink and brown color palette, comedic but hostile."),

    ("monkey_imp.png",
     "A small wild monkey demon from Flower Fruit Mountain. Brown fur, wearing a leaf-woven cap, holding a sharpened stick. Mischievous and aggressive expression, mid-leap with tail curled. Brown and green color palette, playful but dangerous."),

    ("corrupted_soldier.png",
     "A human soldier corrupted by demon energy. Ancient Chinese armor with purple corruption veins glowing through cracks, glowing purple eyes, blank expression. Wielding a standard spear, marching forward in rigid stance. Grey armor with purple corruption glow accents."),

    # 远程型
    ("snake_demon.png",
     "A snake demon with human upper body and serpent lower body. Green scales, feminine face with slit pupils, long black hair, forked tongue visible. Coiled tail supporting upright posture, hands conjuring a green poison orb. Green and dark purple color palette, venomous aura."),

    ("scorpion_imp.png",
     "A small scorpion demon. Dark red chitinous body, humanoid torso on scorpion lower body, curved tail stinger raised and glowing with venom, two pincer claws. Beady black eyes, aggressive stance. Dark red and sandy brown color palette, venomous green stinger tip."),

    ("demon_archer.png",
     "A demon soldier archer. Humanoid demon with blue-grey skin, wearing light leather armor, wielding a bone-crafted bow with a dark energy arrow nocked. Pointed ears, glowing yellow eyes, aiming pose. Dark grey and bone-white color palette with yellow energy accents."),

    ("centipede_spirit.png",
     "A giant centipede demon, partially humanoid. Many-legged dark brown body with red-tipped legs, human-like face on insect head with mandibles, spewing green toxic mist from mouth. Coiled body posture. Dark brown and red with green toxic accents."),

    # 爆炸型
    ("fire_spirit.png",
     "A living fireball demon. Round body made of churning orange-red flames with a menacing face (angry eyes, jagged mouth) formed in the fire. Small flame arms reaching forward, trailing ember particles. Orange, red, and yellow fire palette, bright and dangerous."),

    ("ghost.png",
     "A translucent green ghost/spectre. Wispy ethereal body fading at the bottom (no legs), agonized expression on pale face, hollow dark eyes, reaching forward with ghostly claws. Surrounded by faint green spirit flames. Pale green and white translucent palette, eerie glow."),

    ("fire_crow.png",
     "A crow engulfed in flames, mid-dive. Black feathers with tips on fire, blazing red eyes, beak open in a screech, wings spread in diving attack pose. Trailing fire and embers behind. Black, orange, and red fire palette."),

    # 召唤型
    ("demon_vanguard.png",
     "A demon officer/vanguard holding a tattered battle flag. Wearing mismatched scavenged armor plates, oni-like face with small horns, standing proud with flag planted. The flag has a demonic symbol. Dark iron and red flag color palette, authoritative pose."),

    ("tree_demon.png",
     "A twisted old tree come to life. Gnarled trunk forming a hunched body with a creepy face (hollow eyes, crooked mouth) in the bark, branch-like arms with clawed twig fingers, glowing green root tendrils spreading on ground. Dark brown bark with sickly green leaf and root accents."),

    # 精英型
    ("bear_demon.png",
     "A massive black bear demon standing upright. Thick dark fur, wearing a bone necklace and crude leather belt, small fierce red eyes, open mouth roaring with visible fangs. One huge paw raised to strike, muscular build. Black fur with bone-white necklace and red eye glow."),

    ("bone_general.png",
     "A skeletal warrior general. Bleached white bones wearing rusted ancient Chinese general armor, holding a notched jian sword, blue ghost fire burning in eye sockets. Commanding pose with sword raised. Bone white, rusted iron, and blue ghost-fire palette."),

    ("smoke_demon.png",
     "A humanoid figure made of dark grey smoke. Constantly shifting form with wisps trailing off, two bright ember-orange eyes glowing within the smoke, vague claw-like hands reaching forward. Semi-transparent body. Dark grey smoke with orange ember eye accents."),

    # 环境型
    ("water_ghost.png",
     "A waterlogged ghost/drowned spirit. Green-tinged bloated face, long wet black hair covering one eye, tattered wet robes dripping water, reaching forward with pruned blue-green hands. Water droplets and puddle underneath. Sickly green-blue and dark wet color palette."),

    ("sand_spirit.png",
     "A humanoid figure made of swirling sand. Constantly shifting sandy body with grains streaming off, dark hollow eyes and mouth like holes in a sandstorm, arms dissolving into sand tendrils. Sandy tan with dark brown hollow features, sand particle effects around body."),

    ("ice_spirit.png",
     "A humanoid crystal ice elemental. Semi-transparent icy blue body with visible crystalline structure, cold mist emanating, sharp ice-shard crown on head, frozen expression. Floating slightly off ground with ice forming underneath. Icy blue and white translucent palette with frost particle effects."),

    ("web_spinner.png",
     "A large purple spider demon. Eight hairy purple-black legs, bulbous abdomen with a skull-like pattern, multiple small red eyes, fangs dripping silk. Crouched in web-spinning pose with silk threads trailing from spinnerets. Dark purple and black with red eye accents, silk thread details."),

    ("wind_spirit.png",
     "A living whirlwind with a face. Spinning green-grey tornado body with a vague mischievous face formed in the wind (swirling eyes and grinning mouth), leaves and debris caught in the spin. Floating and spinning. Green-grey wind palette with scattered leaf debris."),

    # 特殊小怪
    ("zombie.png",
     "A Chinese jiangshi zombie. Rigid body in tattered Qing-dynasty official robes, arms outstretched forward, pale greenish-grey skin, ofuda talisman paper partially stuck on forehead, hopping forward. Pale green-grey with faded blue robe, yellow talisman accent."),

    ("stone_imp.png",
     "A round boulder-like stone imp. Spherical rocky body with one large yellow Cyclops eye, small stubby stone legs, crack-line mouth grinning. Rolling forward in attack pose, small rock fragments trailing behind. Grey stone with yellow eye glow, mossy green patches."),

    ("fish_demon.png",
     "An anthropomorphic fish demon (fishman). Standing upright carp body with small legs and arm-fins, fish head with bulging eyes and whiskered mouth, scales shimmering, spitting a water bubble projectile. Blue-green scales with golden carp accent, water bubble effect."),

    ("flower_sprite.png",
     "A small flower fairy/sprite turned hostile. Petal wings (pink and red), tiny humanoid body made of vines and leaves, flower-bud head with glowing angry red eyes, scattering pollen dust. Floating with petal wings spread. Pink, red, and green nature palette with golden pollen particles."),

    ("abyss_creature.png",
     "A dark eldritch tentacle creature from the abyss. Mass of black writhing tentacles emerging from a dark void, multiple glowing red eyes scattered across the body, no clear form — pure darkness with eyes and tentacles. Pitch black with glowing red eyes, dark purple void energy accents."),
]

# ============================================================
# Boss (28张)
# ============================================================
BOSSES = [
    ("stone_golem.png",
     "A massive stone golem formed from Five-Elements Mountain rubble. Towering humanoid rock body with ancient seal inscriptions glowing purple on its surface, cracked stone revealing pulsing dark magic energy within, two burning purple eyes, huge stone fists. Chunks of mountain debris orbiting its body. Grey stone with purple magic glow, ancient Chinese seal script accents."),

    ("black_bear_king.png",
     "The Black Wind Bear King, a massive anthropomorphic black bear demon. Standing upright in a dark cave, wearing a stolen crimson kasaya robe draped over one shoulder, thick black fur, intelligent cunning red eyes, wielding a black iron spear. Black wind/mist swirling around feet. Black fur with crimson robe accent and dark wind effects."),

    ("white_bone_spirit.png",
     "The White Bone Spirit in her true skeletal form. An elegant female skeleton demon with flowing ghostly white hair, wearing tattered white burial robes, bone-white skin with visible skeletal structure underneath, holding a bone staff topped with a skull. Three faint ghostly faces (maiden, old woman, old man) swirling around her. Bone white, ghostly blue-white, with faint pink and grey phantom face accents."),

    ("yellow_robe_demon.png",
     "The Yellow Robe Demon, a handsome but sinister celestial warrior fallen to demonhood. Wearing a magnificent flowing yellow silk robe with star constellation patterns, holding a crescent blade, sharp wolf-like features hidden under elegant appearance. Starlight aura. Golden yellow robe with silver star patterns, celestial blue energy accents."),

    ("gold_horn_king.png",
     "The Gold Horn King, a powerful demon king. Large muscular demon with golden-brown skin, single golden horn on forehead, fierce bearded face, wearing ornate demon general armor, holding the Purple-Gold Red Gourd in one hand and an iron staff in the other. Golden-brown skin with gold horn, dark red armor accents, purple gourd."),

    ("silver_horn_king.png",
     "The Silver Horn King, brother of Gold Horn. Leaner demon with silvery-grey skin, single silver horn on forehead, cunning fox-like expression, wearing lighter demon armor, holding the Mutton-Fat Jade Bottle that glows with suction energy. Silver-grey skin with silver horn, lighter armor, jade-green bottle glow."),

    ("red_boy.png",
     "Red Boy the Demon Child wreathed in true samadhi fire. Young boy appearance with red skin, wild flame-shaped red hair, wearing a red silk belly wrap and gold bangles, wielding a Fire-Tipped Spear. Standing on a wheel of fire, surrounded by intense red-orange samadhi flames. Red skin with orange fire, gold bangle accents, intense fire particle effects."),

    ("tiger_immortal.png",
     "Tiger-Power Great Immortal, a tiger demon disguised as a Taoist priest. Anthropomorphic tiger in elaborate Taoist robes with tiger-stripe patterns showing through, holding a Taoist whisk, arrogant expression, standing in a mystical pose. Tiger orange with Taoist blue robe and gold trim accents."),

    ("deer_immortal.png",
     "Deer-Power Great Immortal, a deer demon disguised as a Taoist priest. Anthropomorphic deer with antlers poking through a Taoist cap, wearing green-brown Taoist robes, holding a medicine gourd, sly expression. Antler tips glowing with mystical energy. Brown deer with green Taoist robe, golden antler glow."),

    ("goat_immortal.png",
     "Goat-Power Great Immortal, a goat demon disguised as a Taoist priest. Anthropomorphic goat with curled horns, long white beard merging with goat beard, wearing white Taoist robes, stirring a bubbling cauldron of oil with a ladle. Smug expression. White goat with white-grey robes, bubbling orange oil cauldron."),

    ("goldfish_king.png",
     "The Goldfish Spirit King, a massive goldfish demon from Tong Tian River. Enormous red-gold carp body with humanoid features forming in the face, wearing coral crown, wielding a trident made of fish bone, surrounded by swirling water and bubbles. Magnificent red-gold scales, coral crown, blue water energy effects."),

    ("scorpion_spirit.png",
     "The Scorpion Spirit, a beautiful woman with scorpion features. Upper body is an alluring woman in dark purple robes holding a pipa lute, lower body transitions to a massive scorpion tail with deadly stinger glowing with venom. Dual nature beauty and danger. Dark purple with venomous green stinger, musical note effects around pipa."),

    ("iron_fan_princess.png",
     "Princess Iron Fan, wife of the Bull Demon King. Elegant but fierce woman in flowing crimson and gold dress, wielding the massive Banana Leaf Fan that is as large as her body, wind energy swirling around the fan. Regal and angry expression, hair blown by her own wind. Crimson and gold dress, green-brown fan with powerful wind energy effects."),

    ("bull_demon_king.png",
     "The Bull Demon King, most powerful demon king. Massive muscular warrior with bull horns, wearing heavy dark armor with gold trim, wielding a huge iron staff. Fierce commanding expression, one eye glowing red. Dark iron armor with gold trim, red energy aura, imposing and powerful."),

    ("blue_lion_demon.png",
     "The Blue Lion Demon of Lion Camel Ridge, mount of Manjusri Bodhisattva gone rogue. Massive blue-maned lion demon with flowing celestial blue mane, wearing broken celestial collar/chains, fierce golden eyes, open mouth revealing fangs and blue energy breath. Celestial blue mane, gold eyes, broken chain accents."),

    ("white_elephant_demon.png",
     "The White Elephant Demon of Lion Camel Ridge, mount of Samantabhadra Bodhisattva gone rogue. Massive white elephant demon in ornate but corrupted celestial armor, long trunk curling aggressively, tusks glowing with power, small angry red eyes. White body with corrupted golden armor, dark energy cracks."),

    ("golden_roc.png",
     "The Golden-Winged Great Peng, the most terrifying demon in Journey to the West, nephew of the Buddha. Enormous bird-humanoid with massive golden wings spread wide, eagle-like fierce face with golden crown, wearing dark battle armor, talons crackling with golden lightning. Wings create golden light. Gold and black with celestial golden wing energy, supreme and terrifying."),

    ("spider_sister.png",
     "One of the Seven Spider Sisters. Beautiful woman upper body with elaborate hairstyle and silken robes, lower body is a large purple-black spider body with eight legs. Spinning silk threads from fingers, multiple small eyes hidden in hair. Alluring but deadly. Purple-black spider body, colorful silk robes upper body, silk thread and web effects."),

    ("hundred_eye_demon.png",
     "The Hundred-Eye Demon Lord, a massive centipede demon with hundreds of eyes. Long segmented dark-brown centipede body coiled upright, torso covered with hundreds of golden eyes that glow intensely, human-like face with multiple extra eyes on forehead. All eyes open and radiating golden light beams. Dark brown body, golden glowing eyes covering entire surface."),

    ("white_deer_spirit.png",
     "The White Deer Spirit, masquerading as a Taoist master. Anthropomorphic white deer in elaborate Taoist ceremonial robes, crystal antlers glowing with life-stealing energy, holding a jade medicine cauldron, sinister smile beneath kind old face. White deer with ornate Taoist robes, crystal antlers with green life-drain energy."),

    ("mouse_spirit.png",
     "The Mouse Spirit Lady in her true form: a large white-furred mouse demon with a golden nose, wearing tattered celestial robes, wielding twin short blades, long white tail, fierce but cunning small eyes. White fur, golden nose accent, tattered celestial blue robes, twin blade gleam."),

    ("leopard_spirit.png",
     "The Leopard Spirit, fastest demon in Journey to the West. Anthropomorphic leopard with distinctive leaf-pattern spotted fur, lean muscular build, wearing light leather armor, wielding twin crescent blades. Crouched in a speed-ready attack pose, motion blur lines. Spotted yellow-gold fur with dark rosettes, speed blur effects, silver blade gleam."),

    ("jade_rabbit.png",
     "The Jade Rabbit Spirit from the Moon Palace. In demon form: an elegant white rabbit-girl with long rabbit ears, wearing flowing moon-white and silver celestial robes, wielding a jade medicine pestle as weapon, surrounded by floating moonlight orbs. Crescent moon behind her. Pure white with silver and moonlight blue, floating moon orbs and crescent moon motif."),

    ("rhino_cold.png",
     "King Bihan, a massive ice-element rhinoceros demon. Armored rhino body with ice crystals growing from hide, blue-white frost horn, wearing frozen armor plates, breath visible as cold mist. Charging pose with frost trail. Blue-white icy hide, crystal ice horn, frost mist effects."),

    ("rhino_heat.png",
     "King Bishu, a massive fire-element rhinoceros demon. Armored rhino body with magma cracks glowing orange through hide, flame-wreathed horn, wearing scorched dark armor. Charging pose with fire trail. Dark grey hide with orange magma cracks, flame horn, fire trail effects."),

    ("rhino_dust.png",
     "King Bichen, a massive wind-element rhinoceros demon. Armored rhino body with swirling sand and wind patterns on hide, tornado-shaped horn, wearing wind-worn leather armor. Charging pose with sand storm trail. Sandy tan hide with wind swirl patterns, tornado horn, sandstorm particle effects."),

    ("zhen_yuan.png",
     "Zhen Yuan the Great Immortal, the Earth Immortal. An ancient but powerful-looking Taoist immortal with kind face hiding immense power. Long white beard, wearing magnificent purple-gold Taoist Grand Master robes with cloud patterns, holding a dusting whisk that radiates reality-warping energy. Ginseng fruit tree faintly visible behind him. Purple-gold robes with white beard, cosmic energy around whisk."),

    ("yellow_wind_king.png",
     "The Yellow Wind King, a marten/sable demon. Anthropomorphic yellow marten with sharp features, wearing tattered brown robes billowing in self-generated wind, mouth wide open blowing devastating yellow sandstorm wind, sand and debris swirling around entire body. Yellow-brown fur with sandy wind storm effects, brown tattered robes, intense wind particle effects."),
]


def main():
    test_mode = "--test" in sys.argv
    workers = 2

    if test_mode:
        common = COMMON_ENEMIES[:2]
        bosses = BOSSES[:1]
        print("=== 测试模式：生成3张样本 ===\n", flush=True)
    else:
        common = COMMON_ENEMIES
        bosses = BOSSES
        print(f"=== 批量生成敌人图片 ({len(common) + len(bosses)} 张, {workers}线程) ===\n", flush=True)

    tasks = []
    for filename, desc in common:
        tasks.append((ENEMY_STYLE + desc, os.path.join("assets/sprites/enemies/common", filename)))
    for filename, desc in bosses:
        tasks.append((BOSS_STYLE + desc, os.path.join("assets/sprites/enemies/bosses", filename)))

    total = len(tasks)
    done = 0
    failed = 0

    with ThreadPoolExecutor(max_workers=workers) as pool:
        futures = {pool.submit(generate_image, prompt, path): path for prompt, path in tasks}
        for future in as_completed(futures):
            done += 1
            path = futures[future]
            ok = future.result()
            if not ok:
                failed += 1
            print(f"  [{done}/{total}] {os.path.basename(path)} {'OK' if ok else 'FAIL'}", flush=True)

    print(f"\n=== 完成: {done - failed}/{total} 成功, {failed} 失败 ===", flush=True)


if __name__ == "__main__":
    main()
