import { set_multiplierText, set_scoreText } from "./statsBar.js";

let current_multiplier = 0;
let finalMultiplier = 0;
let isLeftBlackHoleOpen = false;

let currentScore = 0;

export function stats_start() {
	score_el = document.querySelector();
}

export function modifyMultiplier(amount) {
	current_multiplier += amount;

	updateFinalMultiplier();
}

function updateFinalMultiplier() {
	finalMultiplier = current_multiplier;
	if(isLeftBlackHoleOpen) {
		finalMultiplier += 2;
	}

	set_multiplierText(finalMultiplier);
}

export function set_isLeftBlackHoleOpen(state) {
	isLeftBlackHoleOpen = state;
	updateFinalMultiplier();
}

export function increaseScore(points) {
	const multiplier = finalMultiplier === 0 ? 1 : finalMultiplier; // if multiplier is 0, then make it 1, or else points is * 0
	currentScore += points * multiplier;

	set_scoreText(currentScore);
}