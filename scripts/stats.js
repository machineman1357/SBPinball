import { set_multiplierText } from "./statsBar.js";

let current_multiplier = 0;

export function modifyMultiplier(amount) {
	current_multiplier += amount;

	set_multiplierText(current_multiplier);
}