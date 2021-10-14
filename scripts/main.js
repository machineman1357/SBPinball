import { debugElements_start } from "./debugElements.js";
import { game_start } from "./game.js";
import { paddlesInput_start } from "./paddlesInput.js";
import { phaserSetup_start } from "./phaserSetup.js";

function initialize() {
	
}

function start() {
	phaserSetup_start();
	debugElements_start();
	paddlesInput_start();
	game_start();
}

initialize();
start();