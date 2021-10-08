import { create, preload, update } from "./game.js";

const config = {
    type: Phaser.WEBGL,
    width: 565,
	height: window.innerHeight,
	canvas: document.getElementById('gameCanvas'),
	pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
	physics: {
		default: 'matter',
		matter: {
			gravity: {
                scale: 0
            },
		  	// debug: true
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