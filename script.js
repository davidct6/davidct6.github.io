"use strict";

document.documentElement.classList.add("js");
const menu = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");

function closeMenu() {
  menu.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
}
menu.addEventListener("click", () => {
  const expanded = menu.getAttribute("aria-expanded") === "true";
  menu.setAttribute("aria-expanded", String(!expanded));
  navigation.classList.toggle("is-open", !expanded);
});
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menu.focus();
  }
});
document.querySelector("#year").textContent = String(new Date().getFullYear());

const frequency = document.querySelector("#frequency");
const amplitude = document.querySelector("#amplitude");
const frequencyValue = document.querySelector("#frequency-value");
const amplitudeValue = document.querySelector("#amplitude-value");
const wave = document.querySelector("#wave");
const animateButton = document.querySelector("#animate");
const signalStatus = document.querySelector("#signal-status");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let phase = 0;
let playing = false;
let frameId = 0;
let previousTime = null;

function drawWave() {
  const cycles = Number(frequency.value);
  const gain = Number(amplitude.value);
  const points = [];
  for (let x = 0; x <= 600; x += 2) {
    const y = 160 - Math.sin((x / 600) * cycles * Math.PI * 2 + phase) * gain * 130;
    points.push((x === 0 ? "M" : "L") + x + "," + y.toFixed(2));
  }
  wave.setAttribute("d", points.join(" "));
  frequencyValue.textContent = cycles + (cycles === 1 ? " cycle" : " cycles");
  amplitudeValue.textContent = gain.toFixed(2);
  frequency.setAttribute("aria-valuetext", frequencyValue.textContent);
  amplitude.setAttribute("aria-valuetext", amplitudeValue.textContent);
}

function frame(time) {
  if (!playing) return;
  if (previousTime !== null) phase = (phase + Math.min(time - previousTime, 50) * 0.0015) % (Math.PI * 2);
  previousTime = time;
  drawWave();
  frameId = window.requestAnimationFrame(frame);
}

function setPlaying(value) {
  playing = value;
  window.cancelAnimationFrame(frameId);
  previousTime = null;
  animateButton.setAttribute("aria-pressed", String(playing));
  animateButton.textContent = playing ? "Pause Ⅱ" : "Animate ▶";
  signalStatus.textContent = playing ? "ANIMATING" : "STATIC VIEW";
  if (playing) frameId = window.requestAnimationFrame(frame);
}

frequency.addEventListener("input", drawWave);
amplitude.addEventListener("input", drawWave);
animateButton.addEventListener("click", () => setPlaying(!playing));
document.addEventListener("visibilitychange", () => {
  if (document.hidden) setPlaying(false);
});
reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) setPlaying(false);
});
document.querySelector("#signal-controls").hidden = false;
animateButton.hidden = false;
drawWave();
