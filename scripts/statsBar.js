import { game } from "./phaserSetup.js";

let ref_statsBar;
let ref_scoreEl;
const statsBar_padding = 10;

export function statsBar_start() {
	setRefs();
	setNewStatsBarContainerSize();
}

function setRefs() {
	ref_statsBar = document.querySelector("#statsBar_container");
	ref_scoreEl = document.querySelector("#statsBar_score");
}

export function setNewStatsBarContainerSize() {
	const canvasRect = game.canvas.getBoundingClientRect();
	const twoTimesPadding = statsBar_padding * 2;
	const extraWidth = 2;

	ref_statsBar.style.width = canvasRect.width - twoTimesPadding + extraWidth + "px";
}

function set_scoreText(text) {
	ref_scoreEl.innerHTML = text;
}