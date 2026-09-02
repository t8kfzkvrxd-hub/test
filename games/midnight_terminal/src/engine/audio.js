// BGM・SEを追加する時の窓口。外部素材がなくても、最低限の警告音だけ鳴らせる。
export class AudioManager {
  playBgm() {}
  stopBgm() {}
  playSe(name) {
    if (name !== "door-warning") return;
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return;
    this.context ||= new Context();
    if (this.context.state === "suspended") void this.context.resume();
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, this.context.currentTime);
    gain.gain.setValueAtTime(0.0001, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.045, this.context.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + 0.26);
    oscillator.connect(gain).connect(this.context.destination);
    oscillator.start();
    oscillator.stop(this.context.currentTime + 0.28);
  }
  stopAll() {}
}
