import { PinballScene } from "./scene_pinball.js";
import { PlinkoScene } from "./scene_plinko.js";

const config = {
    type: Phaser.WEBGL,
    width: 565,
	height: window.innerHeight,
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
				y: 0.3 // default: 0.3
            },
		  	// debug: true,
			plugins: {
                attractors: true
            }
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