import { config } from "./config.js";
import { ball, mainScene } from "./scene_pinball.js";
import { set_isLeftBlackHoleOpen } from "./stats.js";

const blocker_position = {
	x: 40,
	y: 160
};
let blocker_go;
let isHoleOpen = false;
let blocker_spirte;
let canEnterHole = true;

export function leftBlackHole_start() {
	create_blocker_collider();
	create_blocker_sprite();
}

export function leftBlackHole_update() {
	// moveSpriteToMousePosAndLog(mainScene, blocker_spirte);
}

function create_blocker_sprite() {
	blocker_spirte = mainScene.add.image(60.69442314152116, 171.8378773200348, "leftBlackHole_blocker");
	blocker_spirte.setScale(1.2);
}

export function on_sideBumperHit() {
	if(!isHoleOpen) {
		isHoleOpen = true;
		openHole();

		setTimeout(() => {
			closeHole();
		}, config.topLeftHole.staysOpenFor_ms);
	}
}

function openHole() {
	blocker_go.setPosition(-1000, 0);
	blocker_spirte.visible = false;
}

function closeHole() {
	isHoleOpen = false;
	blocker_go.setPosition(blocker_position.x, blocker_position.y);
	blocker_spirte.visible = true;
}

function create_blocker_collider() {
	var verts = '16 -871 104 -880 63 -825 40 -769 19 -701';

	var poly = mainScene.add.polygon(blocker_position.x, blocker_position.y, verts, 0x000000, 0.0);

	blocker_go = mainScene.matter.add.gameObject(
		poly, {
		shape: {
			type: 'fromVerts', verts: verts, flagInternal: true
		},
		isStatic: true
	});
}

export function on_ballEnteredHole() {
	if(canEnterHole) {
		ballEnterHole();
	}
}

function ballEnterHole() {
	canEnterHole = false;
	ball.setStatic(true);
	ball.setPosition(62, 68);
	ball.setVelocity(0, 0);
	ball.alpha = 0;

	setTimeout(() => {
		ballExitHole();
	}, config.topLeftHole.timeInHole_ms);
}

function ballExitHole() {
	ball.setStatic(false);
	ball.setVelocity(0, config.topLeftHole.exitHoleVelocityY);
	ball.alpha = 1;

	setTimeout(() => {
		canEnterHole = true;
	}, config.topLeftHole.timeBeforeBallCanEnterHoleAgain_ms);

	set_isLeftBlackHoleOpen(true);
	setTimeout(() => {
		set_isLeftBlackHoleOpen(false);
	}, config.topLeftHole.doublePointsLastFor_ms);
}