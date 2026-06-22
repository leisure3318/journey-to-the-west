const SAVE_KEY = "jtw_save";

export interface SaveData {
  totalRuns: number;
  bestTimeMs: number;
  bestKills: number;
  bestLevel: number;
  bossesDefeated: string[];
  totalKills: number;
  volume: number;
}

function defaultSave(): SaveData {
  return {
    totalRuns: 0,
    bestTimeMs: 0,
    bestKills: 0,
    bestLevel: 0,
    bossesDefeated: [],
    totalKills: 0,
    volume: 1,
  };
}

export class SaveSystem {
  private data: SaveData;

  constructor() {
    this.data = this.load();
  }

  private load(): SaveData {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) return { ...defaultSave(), ...JSON.parse(raw) };
    } catch { /* corrupted save */ }
    return defaultSave();
  }

  private save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(this.data)); } catch { /* quota */ }
  }

  recordRun(elapsedMs: number, kills: number, level: number, bossesKilled: string[]) {
    this.data.totalRuns++;
    this.data.totalKills += kills;
    if (elapsedMs > this.data.bestTimeMs) this.data.bestTimeMs = elapsedMs;
    if (kills > this.data.bestKills) this.data.bestKills = kills;
    if (level > this.data.bestLevel) this.data.bestLevel = level;
    for (const b of bossesKilled) {
      if (!this.data.bossesDefeated.includes(b)) this.data.bossesDefeated.push(b);
    }
    this.save();
  }

  setVolume(v: number) {
    this.data.volume = v;
    this.save();
  }

  get volume() { return this.data.volume; }
  get totalRuns() { return this.data.totalRuns; }
  get bestTimeMs() { return this.data.bestTimeMs; }
  get bestKills() { return this.data.bestKills; }
  get bestLevel() { return this.data.bestLevel; }
  get bossesDefeated() { return this.data.bossesDefeated; }
  get totalKills() { return this.data.totalKills; }

  formatTime(ms: number): string {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  }
}

export const saveSystem = new SaveSystem();
