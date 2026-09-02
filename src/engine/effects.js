export class Effects {
  constructor({ storyScreen, rainLayer }) {
    this.storyScreen = storyScreen;
    this.rainLayer = rainLayer;
  }

  setRain(enabled, intensity = "normal") {
    this.rainLayer.classList.toggle("is-raining", enabled);
    this.rainLayer.classList.toggle("rain-strong", enabled && intensity === "strong");
  }
  shake(duration = 280) { this.#temporaryClass("effect-shake", duration); }
  warning(duration = 420) { this.#temporaryClass("effect-warning", duration); }
  flicker(duration = 180) { this.#temporaryClass("effect-flicker", duration); }
  noise(duration = 350) { this.#temporaryClass("effect-noise", duration); }
  blackout(duration = 180) { this.#temporaryClass("effect-blackout", duration); }
  chromatic(duration = 260) { this.#temporaryClass("effect-chromatic", duration); }

  #temporaryClass(className, duration) {
    this.storyScreen.classList.remove(className);
    void this.storyScreen.offsetWidth;
    this.storyScreen.classList.add(className);
    window.setTimeout(() => this.storyScreen.classList.remove(className), duration);
  }
}
