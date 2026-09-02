export function bindMenu({ menuDialog, openButton, closeButton, restartButton, onRestart }) {
  openButton.addEventListener("click", () => menuDialog.showModal());
  closeButton.addEventListener("click", () => menuDialog.close());
  restartButton.addEventListener("click", () => { onRestart(); menuDialog.close(); });
}
