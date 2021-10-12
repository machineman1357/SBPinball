import { game } from "./phaserSetup.js";

export function getMouseWorldPosition_phaser(mainScene) {
	if(mainScene && game) {
		const cam = mainScene.cameras.main;
		const linePosX = (game.input.activePointer.position.x - (window.innerWidth / 2)) / cam.zoom + cam.midPoint.x;
		const linePosY = (game.input.activePointer.position.y - (window.innerHeight / 2)) / cam.zoom + cam.midPoint.y;
	
		return { x: linePosX, y: linePosY };
	} else {
		console.warn("mainScene or game is undefined");
	}
}