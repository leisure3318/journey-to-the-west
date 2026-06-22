import Phaser from "phaser";
import { POIConfig } from "../config/MapConfig";

const POI_IMAGE_MAP: Record<string, string> = {
  wuzhishan: "poi_wuzhishan",
  yingchoujian: "poi_yingchoujian",
  gaolaozhuang: "poi_gaolaozhuang",
  liushahe: "poi_liushahe",
  heifengshan: "poi_heifengshan",
  huangfengling: "poi_huangfengling",
  baiguling: "poi_baiguling",
  pansidong: "poi_pansidong",
  pingdingshan: "poi_pingdingshan",
  huoyundong: "poi_huoyundong",
};

export class LandmarkSystem {
  private scene: Phaser.Scene;
  private labels = new Map<string, Phaser.GameObjects.Text>();
  private poiImages = new Map<string, Phaser.GameObjects.Image>();
  private poiCircles = new Map<string, Phaser.GameObjects.Graphics>();

  constructor(scene: Phaser.Scene, pois: POIConfig[]) {
    this.scene = scene;
    for (const poi of pois) this.drawPOI(poi);
  }

  hidePOI(id: string) {
    this.labels.get(id)?.setVisible(false);
    this.poiImages.get(id)?.setVisible(false);
    this.poiCircles.get(id)?.setVisible(false);
  }

  private drawPOI(poi: POIConfig) {
    const imgKey = POI_IMAGE_MAP[poi.id];
    if (imgKey && this.scene.textures.exists(imgKey)) {
      const src = this.scene.textures.get(imgKey).getSourceImage() as HTMLImageElement;
      const cs = 512;
      const canvasKey = `poi_faded_${poi.id}`;
      const ct = this.scene.textures.createCanvas(canvasKey, cs, cs);
      const ctx = ct.context;

      const crop = Math.min(src.width, src.height);
      ctx.drawImage(src, (src.width - crop) / 2, (src.height - crop) / 2, crop, crop, 0, 0, cs, cs);

      ctx.globalCompositeOperation = "destination-out";
      const half = cs / 2;
      const grad = ctx.createRadialGradient(half, half, half * 0.4, half, half, half);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(0.55, "rgba(0,0,0,0.35)");
      grad.addColorStop(0.85, "rgba(0,0,0,0.8)");
      grad.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, cs, cs);
      ctx.globalCompositeOperation = "source-over";
      ct.refresh();

      const targetW = poi.radius * 2.4;
      const img = this.scene.add.image(poi.x, poi.y, canvasKey)
        .setDepth(1).setAlpha(0.55).setDisplaySize(targetW, targetW);
      this.poiImages.set(poi.id, img);
    }

    const gfx = this.scene.add.graphics().setDepth(2);
    const color = poi.type === "recruit" ? 0x44ff44 : 0xff4444;
    gfx.lineStyle(1, color, 0.15);
    gfx.strokeCircle(poi.x, poi.y, poi.radius);
    this.poiCircles.set(poi.id, gfx);

    const labelColor = poi.type === "recruit" ? "#44ff44" : "#ff6644";
    const label = this.scene.add.text(poi.x, poi.y - poi.radius - 15, poi.name, {
      fontSize: "14px", color: labelColor, fontStyle: "bold",
      stroke: "#000000", strokeThickness: 3,
    }).setOrigin(0.5).setDepth(3);
    this.labels.set(poi.id, label);
  }
}
