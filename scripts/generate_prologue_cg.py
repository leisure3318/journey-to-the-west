import sys
import os
sys.path.insert(0, os.path.dirname(__file__))
os.chdir(os.path.join(os.path.dirname(__file__), ".."))

from generate_image import generate_image

PROLOGUE_CG = [
    {
        "output": "assets/cutscenes/prologue_01_court.png",
        "prompt": (
            "Cinematic game cutscene illustration, ancient Tang Dynasty imperial court hall. "
            "Emperor Taizong of Tang sits on a golden dragon throne at the center, wearing "
            "imperial yellow dragon robes and a black mianguan crown. Young Buddhist monk "
            "Xuanzang (Tang Monk) kneels before the throne, holding a golden travel permit "
            "scroll. Rows of court officials in colorful silk robes stand on both sides. "
            "Grand red pillars, golden ceiling with dragon carvings, incense smoke drifting. "
            "Warm golden light streaming through the hall. Chinese ink wash painting meets "
            "modern game concept art style. Cinematic composition, dramatic warm lighting, "
            "rich red and gold palette. 16:9 widescreen format."
        ),
    },
    {
        "output": "assets/cutscenes/prologue_02_farewell.png",
        "prompt": (
            "Cinematic game cutscene, outside the grand gate of Chang'an city. Emperor "
            "Taizong personally hands a purple-gold alms bowl to monk Xuanzang, both "
            "standing face to face with hands clasped. A pure white horse waits nearby "
            "with travel supplies. Behind them, hundreds of officials and soldiers line "
            "the ancient city wall. Cherry blossoms or willow catkins float in the warm "
            "spring air. The massive city gate towers behind them. Emotional farewell "
            "atmosphere, golden afternoon sunlight. Chinese ink wash meets modern game "
            "art, warm nostalgic tones, cinematic 16:9 widescreen composition."
        ),
    },
    {
        "output": "assets/cutscenes/prologue_03_alone.png",
        "prompt": (
            "Cinematic game cutscene, lone Buddhist monk Xuanzang riding a white horse "
            "on an ancient dirt road stretching into the distance. Behind him, the "
            "silhouette of Chang'an city walls grows small on the horizon. Dramatic "
            "sunset sky with deep orange, red and purple clouds. Long shadows stretch "
            "across the dusty road. Sparse dead trees along the roadside. A single "
            "monk against the vast wilderness — emphasizing solitude and determination. "
            "Chinese ink wash painting meets modern cinematic game art. Melancholic "
            "yet hopeful atmosphere. 16:9 widescreen, rule of thirds composition with "
            "the monk in the lower left third."
        ),
    },
    {
        "output": "assets/cutscenes/prologue_04_night.png",
        "prompt": (
            "Cinematic game cutscene, moonlit wilderness at night. Monk Xuanzang walks "
            "alone on foot leading his white horse by the reins, holding his nine-ringed "
            "pewter staff that emits a faint golden Buddhist glow in the darkness. Dense "
            "forest on both sides with glowing eyes peering from the shadows — wolves "
            "and unknown creatures watching. A thin crescent moon hangs in the starry sky. "
            "Mist creeps along the ground. The monk's expression is fearful but resolute. "
            "The staff's gentle golden light creates a small safe circle around him. "
            "Chinese ink wash meets dark fantasy game art. Moody blue-black palette with "
            "warm golden light contrast. Atmospheric and slightly ominous. 16:9 widescreen."
        ),
    },
]

if __name__ == "__main__":
    for cg in PROLOGUE_CG:
        if os.path.exists(cg["output"]):
            print(f"跳过（已存在）: {cg['output']}")
            continue
        generate_image(cg["prompt"], cg["output"], size="1536x1024")
    print("序幕CG生成完成")
