import { setNewPaddlesInputContainerSize } from "./paddlesInput.js";
import { setNewStatsBarContainerSize } from "./statsBar.js";

export let ballsUnlockedForPlinko = 1;

export function game_start() {
	setNewPaddlesInputContainerSize();

	window.onresize = function() {
		setNewPaddlesInputContainerSize();
		setNewStatsBarContainerSize();
	}
}

export function increase_ballsUnlockedForPlinko() {
	ballsUnlockedForPlinko += 1;
}