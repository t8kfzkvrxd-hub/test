import { sceneAssets, rainBackgrounds } from "./data/assets.js";
import { prologueChapter } from "./data/chapters/prologue.js";
import { AudioManager } from "./engine/audio.js";
import { Effects } from "./engine/effects.js";
import { Renderer } from "./engine/renderer.js";
import { clearSave, hasSave, loadGame, saveGame } from "./engine/save-system.js";
import { StoryEngine } from "./engine/story-engine.js";
import { renderLog } from "./ui/log.js";
import { bindMenu } from "./ui/menu.js";
import { updateContinueButton } from "./ui/save-load.js";

const $ = (id) => document.getElementById(id);
const chapter = { ...prologueChapter, sceneMap: new Map(prologueChapter.scenes.map((scene) => [scene.id, scene])) };
const chapters = { prologue: chapter };

const renderer = new Renderer({
  storyScreen: $("story-screen"), dialogueBox: $("dialogue-box"), dialogue: $("dialogue"),
  speaker: $("speaker"), chapter: $("chapter-label"), choices: $("choices"), tapHint: $("tap-hint"),
  background: $("background"), backgroundA: $("background"), backgroundB: $("background-next"),
  rainLayer: $("rain-layer"), eventCgLayer: $("event-cg-layer"), eventCgImage: $("event-cg-image"),
  characterSlots: [...document.querySelectorAll(".character")]
});
const effects = new Effects({ storyScreen: $("story-screen"), rainLayer: $("rain-layer") });
const audio = new AudioManager();
const engine = new StoryEngine({ chapters, assets: sceneAssets, rainBackgrounds, renderer, effects, audio, saveGame });

const titleScreen = $("title-screen");
const storyScreen = $("story-screen");
const continueButton = $("continue-button");
const autoButton = $("auto-button");
const menuDialog = $("menu-dialog");
const logDialog = $("log-dialog");

function launch(savedState = null) {
  titleScreen.hidden = true;
  storyScreen.hidden = false;
  engine.start(savedState);
}

$("start-button").addEventListener("click", () => launch());
continueButton.addEventListener("click", () => launch(loadGame(chapters)));
$("log-button").addEventListener("click", () => {
  renderLog($("log-list"), engine.getHistory());
  logDialog.showModal();
});
$("close-log-button").addEventListener("click", () => logDialog.close());
bindMenu({
  menuDialog,
  openButton: $("menu-button"),
  closeButton: $("close-menu-button"),
  restartButton: $("restart-button"),
  onRestart: () => { clearSave(); engine.restart(); updateContinueButton(continueButton, true); }
});
autoButton.addEventListener("click", (event) => {
  engine.setAuto(!engine.auto);
  event.currentTarget.setAttribute("aria-pressed", String(engine.auto));
});
$("dialogue-box").addEventListener("click", () => engine.next());
storyScreen.addEventListener("click", (event) => {
  if (engine.showingEvent && !event.target.closest("button")) engine.revealEvent();
});
document.addEventListener("keydown", (event) => {
  if ([" ", "Enter", "ArrowRight"].includes(event.key) && !menuDialog.open && !logDialog.open) {
    event.preventDefault();
    engine.next();
  }
});
updateContinueButton(continueButton, hasSave(chapters));
