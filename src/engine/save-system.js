import { SAVE_VERSION, createInitialState } from "./state.js";

const SAVE_KEY = "midnight-terminal-save-v1";
const LEGACY_PROGRESS_KEY = "midnight-terminal-prologue-v2-progress";

export function saveGame(state) {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ saveVersion: SAVE_VERSION, state }));
}

export function loadGame(chapters) {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (saved?.saveVersion === SAVE_VERSION && saved.state) return saved.state;
  } catch { /* 壊れた保存データは初期状態として扱う */ }

  const legacyIndex = Number(localStorage.getItem(LEGACY_PROGRESS_KEY));
  const chapter = chapters.prologue;
  if (legacyIndex > 0 && chapter) {
    const state = createInitialState();
    state.sceneId = chapter.scenes[Math.min(legacyIndex, chapter.scenes.length - 1)].id;
    return state;
  }
  return null;
}

export function hasSave(chapters) { return Boolean(loadGame(chapters)); }
export function clearSave() {
  localStorage.removeItem(SAVE_KEY);
  localStorage.removeItem(LEGACY_PROGRESS_KEY);
}
