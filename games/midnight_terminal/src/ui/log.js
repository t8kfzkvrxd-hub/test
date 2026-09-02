export function renderLog(logList, scenes) {
  logList.replaceChildren();
  if (!scenes.length) {
    const empty = document.createElement("p");
    empty.className = "log-empty";
    empty.textContent = "まだ履歴はありません。";
    logList.append(empty);
    return;
  }
  scenes.forEach((scene) => {
    const entry = document.createElement("article");
    entry.className = "log-entry";
    if (scene.speaker) {
      const name = document.createElement("span");
      name.className = "log-speaker";
      name.textContent = scene.speaker;
      entry.append(name);
    }
    entry.append(document.createTextNode(scene.text));
    logList.append(entry);
  });
  logList.scrollTop = logList.scrollHeight;
}
