import { setNewPaddlesInputContainerSize } from "./paddlesInput.js";
import { game } from "./phaserSetup.js";
import { setNewStatsBarContainerSize } from "./statsBar.js";

export let ballsUnlockedForPlinko = 1;

export function game_start() {
	setNewPaddlesInputContainerSize();
	setCanvasSize();

	window.onresize = function() {
		setNewPaddlesInputContainerSize();
		setNewStatsBarContainerSize();
		// setCanvasSize();
	}
}

export function increase_ballsUnlockedForPlinko() {
	ballsUnlockedForPlinko += 1;
}

function setCanvasSize() {
	const maxWidth = 565;
	const maxHeight = 854;
	const widthPercentageOfMaxWidth = window.innerWidth / maxWidth;
	const newHeightFromRatio = widthPercentageOfMaxWidth * maxHeight;

	game.canvas.style.width = window.innerWidth + "px";
	game.canvas.style.height = newHeightFromRatio + "px";

	// game.canvas.style.height = "853.636px";
	// game.canvas.style.width = "564.759px";
}