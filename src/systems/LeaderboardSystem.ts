const SUPABASE_URL = "https://nbqdsceslqsuojixshth.supabase.co";
const SUPABASE_KEY = "sb_publishable_P612EX11zgV3v1fw4CdL6A_bP9F3HaH";

export interface ScoreEntry {
  id?: number;
  name: string;
  score: number;
  kills: number;
  stage_index: number;
  hp_ratio: number;
  elapsed_ms: number;
  created_at?: string;
}

const HEADERS = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

export async function submitScore(entry: Omit<ScoreEntry, "id" | "created_at">): Promise<boolean> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/scores`, {
      method: "POST",
      headers: { ...HEADERS, "Prefer": "return=minimal" },
      body: JSON.stringify(entry),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchTopScores(limit = 20): Promise<ScoreEntry[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/scores?select=*&order=score.desc&limit=${limit}`,
      { headers: HEADERS },
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export function calcScore(kills: number, stageIndex: number, hpRatio: number): number {
  return kills * 10 + stageIndex * 500 + Math.floor(hpRatio * 200);
}

export function getSavedName(): string {
  return localStorage.getItem("leaderboard_name") ?? "";
}

export function saveName(name: string) {
  localStorage.setItem("leaderboard_name", name);
}

export function showSubmitDialog(
  score: number,
  kills: number,
  stageIndex: number,
  hpRatio: number,
  elapsedMs: number,
  onDone?: () => void,
) {
  const overlay = document.createElement("div");
  overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:99998;";

  const box = document.createElement("div");
  box.style.cssText = "background:#1a1a2e;border:2px solid #ffaa00;padding:28px 36px;border-radius:8px;text-align:center;font-family:monospace;color:#fff;min-width:300px;";
  box.innerHTML = `
    <div style="color:#ffdd44;font-size:20px;font-weight:bold;margin-bottom:8px;">上传天梯榜</div>
    <div style="color:#aaa;font-size:13px;margin-bottom:16px;">得分 ${score} &nbsp;|&nbsp; 击杀 ${kills} &nbsp;|&nbsp; 第${stageIndex + 1}关</div>
    <input id="lb-name-input" placeholder="输入名字（最多10字）" maxlength="10"
      style="background:#2a2a4e;border:1px solid #4466aa;color:#fff;padding:8px 12px;font-size:15px;border-radius:4px;width:200px;text-align:center;outline:none;box-sizing:border-box;" />
    <div id="lb-msg" style="height:18px;font-size:12px;color:#ff8844;margin-top:6px;"></div>
    <div style="margin-top:12px;display:flex;gap:12px;justify-content:center;">
      <button id="lb-submit-btn" style="background:#ffaa00;color:#000;border:none;padding:9px 22px;font-size:14px;font-weight:bold;border-radius:4px;cursor:pointer;">提交</button>
      <button id="lb-skip-btn" style="background:#2a2a4e;color:#aaa;border:1px solid #555;padding:9px 16px;font-size:14px;border-radius:4px;cursor:pointer;">跳过</button>
    </div>`;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  const input = document.getElementById("lb-name-input") as HTMLInputElement;
  const msg = document.getElementById("lb-msg")!;
  input.value = getSavedName();
  setTimeout(() => input.focus(), 50);

  const cleanup = () => { overlay.remove(); onDone?.(); };

  document.getElementById("lb-skip-btn")!.onclick = cleanup;
  document.getElementById("lb-submit-btn")!.onclick = async () => {
    const name = input.value.trim() || "匿名玩家";
    saveName(name);
    msg.textContent = "提交中...";
    msg.style.color = "#ffdd44";
    const ok = await submitScore({ name, score, kills, stage_index: stageIndex, hp_ratio: hpRatio, elapsed_ms: elapsedMs });
    if (ok) {
      msg.textContent = "✓ 已上榜！";
      msg.style.color = "#66ff66";
      setTimeout(cleanup, 800);
    } else {
      msg.textContent = "提交失败，请检查网络";
      msg.style.color = "#ff4444";
    }
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") (document.getElementById("lb-submit-btn") as HTMLButtonElement).click();
  });
}
