import { PinballScene } from "./scene_pinball.js";
import { PlinkoScene } from "./scene_plinko.js";

const config = {
    type: Phaser.WEBGL,
    width: 565,
	height: 854 /*window.innerHeight*/,
	canvas: document.getElementById('gameCanvas'),
	// pixelArt: true,
    scene: [
		PinballScene,
		PlinkoScene
	],
	physics: {
		default: 'matter',
		matter: {
			gravity: {
                x: 0,
				y: 0.18 // default: 0.15
            },
		  	// debug: true,
			plugins: {
                attractors: true
            },
			positionIterations: 12,
			velocityIterations: 8
		}
	},
	scale: {
		mode: Phaser.Scale.FIT,
		parent: 'game',
	},
};

export let game;

export function phaserSetup_start() {
	game = new Phaser.Game(config);
}