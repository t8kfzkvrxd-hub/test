export class Renderer {
  constructor(dom) {
    Object.assign(this, dom);
    this.preloaded = new Map();
  }

  preload(paths) {
    paths.filter(Boolean).forEach((path) => {
      if (this.preloaded.has(path)) return;
      const image = new Image();
      image.src = path;
      this.preloaded.set(path, image);
    });
  }

  showScene(scene, { backgroundPath, backgroundChanged }) {
    this.speaker.textContent = scene.speaker || "";
    this.dialogue.textContent = scene.text;
    this.chapter.textContent = scene.chapter || "";
    this.choices.replaceChildren();
    const presentation = scene.presentation || {};
    this.setEventCg(presentation.eventCg, backgroundPath, presentation.eventPosition);
    const hideDialogue = Boolean(scene.event || presentation.hideDialogue);
    this.dialogueBox.hidden = hideDialogue;
    this.dialogueBox.style.cursor = scene.choices || scene.end ? "default" : "pointer";
    this.tapHint.hidden = Boolean(hideDialogue || scene.choices || scene.end);
    this.storyScreen.classList.toggle("event-showing", hideDialogue);
    this.setCharacters(scene.characters || []);
    if (backgroundChanged) this.swapBackground(backgroundPath, { event: hideDialogue, camera: presentation.camera });
    else this.animateBackground({ changed: false, event: hideDialogue, camera: presentation.camera });
    if (!hideDialogue) this.animateDialogue();
  }

  swapBackground(path, { immediate = false, event = false, camera } = {}) {
    const current = this.background;
    const incoming = current === this.backgroundA ? this.backgroundB : this.backgroundA;
    const reveal = () => {
      incoming.style.backgroundImage = `url("${path}")`;
      incoming.classList.remove("scene-transition", "event-focus");
      if (immediate) incoming.style.transition = "none";
      incoming.classList.add("is-visible");
      current.classList.remove("is-visible", "scene-transition", "event-focus");
      this.background = incoming;
      this.animateBackground({ changed: !immediate, event, camera });
      if (immediate) incoming.style.removeProperty("transition");
    };
    const image = this.preloaded.get(path);
    if (!immediate && image && !image.complete) {
      image.addEventListener("load", reveal, { once: true });
      image.addEventListener("error", reveal, { once: true });
    } else reveal();
  }

  animateBackground({ changed, event, camera } = {}) {
    this.background.classList.remove("scene-transition", "event-focus");
    if (camera) this.background.dataset.camera = camera;
    else delete this.background.dataset.camera;
    void this.background.offsetWidth;
    if (changed && !camera) this.background.classList.add("scene-transition");
    if (event && !camera) this.background.classList.add("event-focus");
  }

  revealDialogue({ keepEventCg = false } = {}) {
    this.storyScreen.classList.remove("event-showing");
    if (!keepEventCg) this.hideEventCg();
    this.dialogueBox.hidden = false;
    this.tapHint.hidden = keepEventCg;
    this.animateDialogue();
  }

  setEventCg(mode, path, position = "center") {
    if (mode === "show") this.showEventCg(path, position);
    else if (mode !== "keep") this.hideEventCg();
  }

  showEventCg(path, position) {
    this.eventCgImage.src = path;
    this.eventCgImage.style.objectPosition = position;
    this.eventCgLayer.style.setProperty("--event-cg-image", `url("${path}")`);
    this.eventCgLayer.classList.add("is-visible");
    this.storyScreen.classList.add("event-cg-active");
  }

  hideEventCg() {
    this.eventCgLayer.classList.remove("is-visible");
    this.storyScreen.classList.remove("event-cg-active");
  }

  animateDialogue() {
    this.dialogueBox.classList.remove("dialogue-reveal");
    void this.dialogueBox.offsetWidth;
    this.dialogueBox.classList.add("dialogue-reveal");
  }

  renderChoices(choices, onChoose) {
    this.choices.replaceChildren();
    choices.forEach((choice) => {
      const button = document.createElement("button");
      button.className = "choice";
      button.textContent = `▶ ${choice.label}`;
      button.addEventListener("click", () => onChoose(choice));
      this.choices.append(button);
    });
  }

  renderEnd(onRestart) {
    const button = document.createElement("button");
    button.className = "choice";
    button.textContent = "最初から読む";
    button.addEventListener("click", onRestart);
    this.choices.append(button);
  }

  setCharacters(characters) {
    const byPosition = new Map(characters.map((item) => [item.position, item]));
    this.characterSlots.forEach((slot) => {
      const definition = byPosition.get(slot.dataset.position);
      slot.classList.toggle("character-hidden", !definition || definition.visible === false);
      if (!definition?.src) return;
      let image = slot.querySelector("img");
      if (!image) { image = document.createElement("img"); slot.replaceChildren(image); }
      image.src = definition.src;
      image.alt = "";
      slot.classList.toggle("character-shake", definition.effect === "shake");
    });
  }
}
