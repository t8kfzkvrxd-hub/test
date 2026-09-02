import { applyStateChanges, createInitialState, markSceneSeen } from "./state.js";

export class StoryEngine {
  constructor({ chapters, assets, rainBackgrounds, renderer, effects, audio, saveGame }) {
    this.chapters = chapters;
    this.assets = assets;
    this.rainBackgrounds = rainBackgrounds;
    this.renderer = renderer;
    this.effects = effects;
    this.audio = audio;
    this.saveGame = saveGame;
    this.state = createInitialState();
    this.activeBackground = "station";
    this.showingEvent = false;
    this.auto = false;
    this.autoTimer = undefined;
    this.eventTimer = undefined;
  }

  start(savedState = null) {
    this.state = savedState || createInitialState();
    this.activeBackground = this.#backgroundBefore(this.state.sceneId);
    const scene = this.currentScene;
    this.renderer.swapBackground(this.assets[this.activeBackground], { immediate: true, event: false });
    this.showCurrentScene();
  }

  get currentChapter() { return this.chapters[this.state.chapterId]; }
  get currentScene() { return this.currentChapter?.sceneMap.get(this.state.sceneId); }
  get hasSaveData() { return Boolean(this.state.sceneHistory.length); }

  showCurrentScene() {
    const scene = this.currentScene;
    if (!scene) throw new Error(`Scene not found: ${this.state.chapterId}/${this.state.sceneId}`);
    window.clearTimeout(this.autoTimer);
    window.clearTimeout(this.eventTimer);
    const previousBackground = this.activeBackground;
    if (scene.background) this.activeBackground = scene.background;
    const changed = this.activeBackground !== previousBackground;
    this.renderer.preload(this.#nearbyAssetPaths());
    this.renderer.showScene(scene, {
      backgroundPath: this.assets[this.activeBackground],
      backgroundChanged: changed
    });
    const presentation = scene.presentation || {};
    this.effects.setRain(this.rainBackgrounds.has(this.activeBackground), presentation.rain || "normal");
    if (presentation.warning) this.effects.warning(presentation.warningDuration);
    if (presentation.shake) this.effects.shake(presentation.shakeDuration);
    if (presentation.se) this.audio?.playSe(presentation.se);
    this.showingEvent = Boolean(scene.event);
    markSceneSeen(this.state, scene.id);
    this.saveGame(this.state);
    if (scene.event) this.eventTimer = window.setTimeout(() => this.revealEvent(), presentation.eventDuration ?? 3400);
    if (scene.choices) this.renderer.renderChoices(this.#normaliseChoices(scene.choices), (choice) => this.choose(choice));
    if (scene.end) this.renderer.renderEnd(() => this.restart());
    if (this.auto && !scene.choices && !scene.end) {
      const readingTime = Math.max(2600, scene.text.length * 55);
      this.autoTimer = window.setTimeout(() => this.next(), (scene.event ? (presentation.eventDuration ?? 3400) : 0) + readingTime);
    }
  }

  next() {
    const scene = this.currentScene;
    if (!scene || scene.choices || scene.end) return;
    if (!scene.next) return;
    this.state.sceneId = scene.next;
    this.showCurrentScene();
  }

  choose(choice) {
    applyStateChanges(this.state, choice.changes);
    this.state.choiceHistory.push({ chapterId: this.state.chapterId, sceneId: this.state.sceneId, choiceId: choice.id });
    this.state.sceneId = choice.next;
    this.showCurrentScene();
  }

  revealEvent() {
    if (!this.showingEvent) return;
    this.showingEvent = false;
    this.renderer.revealDialogue({ keepEventCg: Boolean(this.currentScene?.presentation?.keepEventCgAfterReveal) });
  }

  setAuto(enabled) {
    this.auto = enabled;
    if (enabled) this.showCurrentScene();
    else window.clearTimeout(this.autoTimer);
  }

  restart() {
    window.clearTimeout(this.autoTimer);
    window.clearTimeout(this.eventTimer);
    this.start();
  }

  getHistory() { return this.state.sceneHistory.map((id) => this.currentChapter.sceneMap.get(id)).filter(Boolean); }

  #backgroundBefore(sceneId) {
    let background = "station";
    for (const scene of this.currentChapter.scenes) {
      if (scene.background) background = scene.background;
      if (scene.id === sceneId) break;
    }
    return background;
  }

  #nearbyAssetPaths() {
    const scenes = this.currentChapter.scenes;
    const index = scenes.findIndex((scene) => scene.id === this.state.sceneId);
    return scenes.slice(index, index + 5).map((scene) => this.assets[scene.background]).filter(Boolean);
  }

  #normaliseChoices(choices) {
    return choices.map((choice, index) => typeof choice === "string"
      ? { id: `choice_${index}`, label: choice, next: this.currentScene.next }
      : choice);
  }
}
