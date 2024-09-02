// The progress bar div element.
const progressContainer = document.querySelector(".progress");

// The progress bar div element.
const progressBar = progressContainer.querySelector(".progress-bar");

export function reset() {
  progressContainer.style.display = "none";
  progressBar.style.width = "0";
}

export function set(value) {
  progressContainer.style.removeProperty("display");
  progressBar.style.width = value + "%";
  progressBar.textContent = `Load images (${value}%)`;
}

reset();