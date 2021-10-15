import { game } from "./phaserSetup.js";
import { mainScene } from "./scene_pinball.js";
import { modifyMultiplier } from "./stats.js";

let image;
const multipliers = {
	left: undefined,
	middle: undefined,
	right: undefined
}

export function multipliers_start() {
	multipliers.left = mainScene.add.image(196.58136708825936, 209.50097371894657, "multiplier_activated").setVisible(false);
	multipliers.middle = mainScene.add.image(269.5537364845706, 170.6609055575688, "multiplier_activated").setVisible(false);
	multipliers.right = mainScene.add.image(342.5261058808819, 174.19182084496677, "multiplier_activated").setVisible(false);
}

export function multipliers_update() {
	const cam = mainScene.cameras.main;
	const mousePos_x = game.input.activePointer.position.x / cam.zoom;
	const mousePos_y = game.input.activePointer.position.y / cam.zoom;

	// multipliers["right"].x = mousePos_x;
	// multipliers["right"].y = mousePos_y;
	// console.log(mousePos_x, mousePos_y);
}

export function toggleMultiplier(name) {
	const isVisible = multipliers[name].visible;

	// if it was visible, then it will be invisible, so remove 3 multipliers
	if(isVisible) {
		modifyMultiplier(-3);
	} else {
		modifyMultiplier(3);
	}

	multipliers[name].visible = !isVisible;
}