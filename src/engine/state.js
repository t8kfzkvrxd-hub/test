export const SAVE_VERSION = 1;

export function createInitialState() {
  return {
    saveVersion: SAVE_VERSION,
    chapterId: "prologue",
    sceneId: "prologue_001",
    affinity: {},
    memoryFlags: {},
    choiceHistory: [],
    seenSceneIds: [],
    sceneHistory: [],
    loopCount: 0,
    endings: []
  };
}

export function markSceneSeen(state, sceneId) {
  if (!state.seenSceneIds.includes(sceneId)) state.seenSceneIds.push(sceneId);
  if (state.sceneHistory.at(-1) !== sceneId) state.sceneHistory.push(sceneId);
}

export function applyStateChanges(state, changes = {}) {
  Object.entries(changes.affinity || {}).forEach(([id, value]) => {
    state.affinity[id] = (state.affinity[id] || 0) + value;
  });
  Object.assign(state.memoryFlags, changes.memoryFlags || {});
}
