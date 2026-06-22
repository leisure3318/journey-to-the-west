const MASTER_VOL = 0.15;

export class SoundManager {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private lastPlayed = new Map<string, number>();
  private _muted = false;
  private _volume = 1;
  private bgmActive = false;
  private bgmTimer: ReturnType<typeof setTimeout> | null = null;

  private ensureCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = MASTER_VOL * this._volume;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  setVolume(v: number) {
    this._volume = Math.max(0, Math.min(1, v));
    if (this.master && !this._muted) {
      this.master.gain.value = MASTER_VOL * this._volume;
    }
  }

  get volume() { return this._volume; }

  private canPlay(id: string, cooldownMs: number): boolean {
    if (this._muted) return false;
    const now = performance.now();
    const last = this.lastPlayed.get(id) ?? 0;
    if (now - last < cooldownMs) return false;
    this.lastPlayed.set(id, now);
    return true;
  }

  private tone(freq: number, dur: number, vol: number, type: OscillatorType = "sine", delay = 0) {
    const ctx = this.ensureCtx();
    if (!this.master) return;
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain).connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.01);
  }

  private noise(dur: number, vol: number, delay = 0) {
    const ctx = this.ensureCtx();
    if (!this.master) return;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    const t = ctx.currentTime + delay;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(gain).connect(this.master);
    src.start(t);
  }

  // --- BGM ---

  startBgm() {
    if (this.bgmActive) return;
    this.bgmActive = true;
    this.scheduleBgmNote();
  }

  stopBgm() {
    this.bgmActive = false;
    if (this.bgmTimer) { clearTimeout(this.bgmTimer); this.bgmTimer = null; }
  }

  private scheduleBgmNote() {
    if (!this.bgmActive || this._muted) return;
    const pentatonic = [262, 294, 330, 392, 440, 523, 587, 659];
    const freq = pentatonic[Math.floor(Math.random() * pentatonic.length)];
    this.tone(freq, 2.0, 0.05, "sine");
    if (Math.random() < 0.25) {
      const f2 = pentatonic[Math.floor(Math.random() * pentatonic.length)];
      this.tone(f2, 1.6, 0.03, "sine", 0.5);
    }
    if (Math.random() < 0.15) {
      this.tone(131, 3.0, 0.025, "triangle");
    }
    const delay = 1200 + Math.random() * 1800;
    this.bgmTimer = setTimeout(() => this.scheduleBgmNote(), delay);
  }

  // 菜单BGM：更缓慢、更空灵
  startMenuBgm() {
    if (this.bgmActive) return;
    this.bgmActive = true;
    this.scheduleMenuNote();
  }

  private scheduleMenuNote() {
    if (!this.bgmActive || this._muted) return;
    const scale = [262, 330, 392, 523, 659];
    const freq = scale[Math.floor(Math.random() * scale.length)];
    this.tone(freq, 3.0, 0.04, "sine");
    if (Math.random() < 0.3) {
      this.tone(131, 4.0, 0.02, "triangle");
    }
    const delay = 2000 + Math.random() * 3000;
    this.bgmTimer = setTimeout(() => this.scheduleMenuNote(), delay);
  }

  // --- 经验/升级 ---

  xpPickup() {
    if (!this.canPlay("xp", 50)) return;
    this.tone(800 + Math.random() * 400, 0.07, 0.25);
  }

  levelUp() {
    if (!this.canPlay("lvl", 500)) return;
    this.tone(523, 0.15, 0.4);
    this.tone(659, 0.15, 0.35, "sine", 0.1);
    this.tone(784, 0.25, 0.4, "sine", 0.2);
  }

  skillUp() {
    if (!this.canPlay("sk", 200)) return;
    this.tone(440, 0.1, 0.3);
    this.tone(554, 0.1, 0.25, "sine", 0.08);
    this.tone(659, 0.15, 0.3, "sine", 0.16);
  }

  evolution() {
    if (!this.canPlay("evo", 1000)) return;
    this.tone(392, 0.2, 0.4, "triangle");
    this.tone(494, 0.2, 0.35, "sine", 0.1);
    this.tone(587, 0.2, 0.35, "sine", 0.2);
    this.tone(784, 0.3, 0.4, "sine", 0.3);
    this.tone(1047, 0.5, 0.35, "sine", 0.45);
    this.noise(0.15, 0.08, 0.3);
  }

  // --- 敌人/战斗 ---

  enemyDeath() {
    if (!this.canPlay("ed", 30)) return;
    this.tone(180 + Math.random() * 60, 0.08, 0.15);
    this.noise(0.04, 0.1);
  }

  enemyHit() {
    if (!this.canPlay("eh", 40)) return;
    this.tone(300 + Math.random() * 100, 0.04, 0.1);
  }

  playerHit() {
    if (!this.canPlay("ph", 300)) return;
    this.tone(110, 0.12, 0.3, "triangle");
    this.noise(0.06, 0.15);
  }

  shieldHit() {
    if (!this.canPlay("sh", 200)) return;
    this.tone(500, 0.06, 0.2);
    this.tone(700, 0.04, 0.15, "sine", 0.03);
  }

  explosion() {
    if (!this.canPlay("ex", 200)) return;
    this.tone(80, 0.2, 0.25, "triangle");
    this.noise(0.1, 0.2);
  }

  // --- Boss ---

  bossAppear() {
    if (!this.canPlay("ba", 3000)) return;
    this.tone(70, 0.8, 0.5, "triangle");
    this.tone(105, 0.6, 0.3, "sine", 0.1);
    this.tone(55, 1.0, 0.35, "sine", 0.05);
  }

  bossDefeat() {
    if (!this.canPlay("bd", 3000)) return;
    this.tone(392, 0.3, 0.4);
    this.tone(494, 0.3, 0.35, "sine", 0.15);
    this.tone(587, 0.3, 0.35, "sine", 0.3);
    this.tone(784, 0.5, 0.4, "sine", 0.45);
  }

  // --- 宝箱/物品 ---

  chestOpen() {
    if (!this.canPlay("ch", 300)) return;
    this.tone(600, 0.1, 0.25);
    this.tone(900, 0.1, 0.2, "sine", 0.08);
    this.tone(1200, 0.12, 0.25, "sine", 0.16);
    this.tone(1500, 0.18, 0.2, "sine", 0.24);
  }

  itemUse() {
    if (!this.canPlay("iu", 150)) return;
    this.tone(440, 0.08, 0.25);
    this.tone(660, 0.1, 0.2, "sine", 0.06);
  }

  // --- 唐僧技能 ---

  headband() {
    if (!this.canPlay("hb", 1000)) return;
    this.tone(523, 0.15, 0.35, "triangle");
    this.tone(659, 0.12, 0.3, "sine", 0.08);
    this.tone(784, 0.15, 0.35, "sine", 0.16);
    this.tone(1047, 0.2, 0.3, "sine", 0.26);
  }

  mercy() {
    if (!this.canPlay("mc", 1000)) return;
    this.tone(392, 0.3, 0.3, "sine");
    this.tone(523, 0.3, 0.25, "sine", 0.15);
    this.tone(659, 0.3, 0.25, "sine", 0.3);
    this.tone(784, 0.4, 0.3, "sine", 0.45);
    this.tone(262, 0.8, 0.1, "triangle", 0.1);
  }

  ultimate() {
    if (!this.canPlay("ult", 1000)) return;
    this.tone(220, 0.3, 0.35, "triangle");
    this.tone(330, 0.25, 0.25, "sine", 0.1);
    this.tone(440, 0.3, 0.3, "sine", 0.2);
    this.noise(0.12, 0.1, 0.05);
  }

  // --- 收徒/坐骑 ---

  recruit() {
    if (!this.canPlay("rec", 1000)) return;
    this.tone(330, 0.2, 0.35);
    this.tone(392, 0.2, 0.3, "sine", 0.12);
    this.tone(494, 0.2, 0.3, "sine", 0.24);
    this.tone(587, 0.2, 0.3, "sine", 0.36);
    this.tone(659, 0.35, 0.4, "sine", 0.48);
    this.tone(330, 0.3, 0.15, "triangle", 0.1);
  }

  mountHorse() {
    if (!this.canPlay("mh", 2000)) return;
    this.tone(294, 0.12, 0.25);
    this.tone(392, 0.12, 0.25, "sine", 0.08);
    this.tone(494, 0.15, 0.3, "sine", 0.16);
    this.noise(0.06, 0.08, 0.1);
  }

  // --- 状态 ---

  deathSave() {
    if (!this.canPlay("ds", 1000)) return;
    this.tone(200, 0.15, 0.35, "triangle");
    this.tone(400, 0.12, 0.3, "sine", 0.08);
    this.tone(600, 0.15, 0.35, "sine", 0.16);
    this.noise(0.08, 0.15);
  }

  heal() {
    if (!this.canPlay("hl", 3000)) return;
    this.tone(523, 0.12, 0.2);
    this.tone(659, 0.15, 0.2, "sine", 0.08);
  }

  lowHpWarning() {
    if (!this.canPlay("lhp", 5000)) return;
    this.tone(330, 0.15, 0.2, "triangle");
    this.tone(330, 0.15, 0.2, "triangle", 0.25);
  }

  // --- 结局 ---

  victory() {
    if (!this.canPlay("vic", 3000)) return;
    const notes = [523, 587, 659, 784, 880, 1047];
    for (let i = 0; i < notes.length; i++) {
      this.tone(notes[i], 0.3, 0.35, "sine", i * 0.12);
    }
    this.tone(523, 1.0, 0.15, "triangle", 0.1);
    this.tone(784, 0.8, 0.15, "triangle", 0.3);
  }

  gameOver() {
    if (!this.canPlay("go", 3000)) return;
    this.tone(330, 0.4, 0.35, "triangle");
    this.tone(262, 0.4, 0.3, "sine", 0.3);
    this.tone(220, 0.5, 0.3, "sine", 0.6);
    this.tone(196, 0.8, 0.25, "sine", 0.9);
  }

  // --- 波次/UI ---

  waveChange() {
    if (!this.canPlay("wv", 3000)) return;
    this.tone(220, 0.2, 0.25, "triangle");
    this.tone(294, 0.2, 0.2, "sine", 0.12);
    this.tone(392, 0.25, 0.3, "sine", 0.24);
    this.noise(0.06, 0.08, 0.2);
  }

  pause() {
    if (!this.canPlay("pa", 300)) return;
    this.tone(400, 0.08, 0.2);
    this.tone(300, 0.1, 0.15, "sine", 0.05);
  }

  resume() {
    if (!this.canPlay("rs", 300)) return;
    this.tone(300, 0.08, 0.2);
    this.tone(400, 0.1, 0.15, "sine", 0.05);
  }

  menuClick() {
    if (!this.canPlay("mc2", 100)) return;
    this.tone(600, 0.06, 0.25);
    this.tone(800, 0.05, 0.2, "sine", 0.04);
  }

  // 序幕打字机音
  typewriter() {
    if (!this.canPlay("tw", 30)) return;
    this.tone(600 + Math.random() * 200, 0.03, 0.1);
  }

  // 序幕翻页
  pageFlip() {
    if (!this.canPlay("pf", 200)) return;
    this.noise(0.06, 0.15);
    this.tone(400, 0.06, 0.12, "sine", 0.02);
  }

  // --- 控制 ---

  toggleMute(): boolean {
    this._muted = !this._muted;
    if (this.master) this.master.gain.value = this._muted ? 0 : MASTER_VOL * this._volume;
    if (this._muted) this.stopBgm();
    else this.startBgm();
    return this._muted;
  }

  get muted() { return this._muted; }
}
