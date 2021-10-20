import { on_sideBumperHit } from "./leftBlackHole.js";
import { game } from "./phaserSetup.js";
import { mainScene } from "./scene_pinball.js";

const onHitMoveLeft = -5;
const timeBefore_resetPosFromLeft = 250;

export function wallBumper_start() {
	new WallBumper({
		xPos: 78.34902864062873,
		yPos: 637.9186952565676
	});
	new WallBumper({
		isRight: true,
		xPos: 460.86548112129276,
		yPos: 637.9186952565676
	});
}

export function wallBumper_update() {
	
}

class WallBumper {
	constructor(options) {
		this.isRight = options.isRight !== undefined ? options.isRight : false
		this.container;
		this.tube;
		this.xPos = options.xPos;
		this.yPos = options.yPos;
		this.isPushedIn = false;

		this.create();
		this.createCollider();
	}

	create() {
		this.container = mainScene.add.container(this.xPos, this.yPos);
		if(this.isRight) {
			this.container.scaleX = -1;
		}

		this.tube = mainScene.add.image(0, 0, "wallBumper_l_tube");
		const edge = mainScene.add.image(0, 0, "wallBumper_l_edge");
		this.container.add([this.tube, edge]);
	}

	update() {
		// this.moveToMouse(0, 0);
	}

	moveToMouse(extraX, extraY) {
		const cam = mainScene.cameras.main;
		this.container.x = game.input.activePointer.position.x / cam.zoom + extraX;
		this.container.y = game.input.activePointer.position.y / cam.zoom + extraY;
		console.log(this.container.x, this.container.y);
	}

	createCollider() {
		const collider = mainScene.matter.add.rectangle(this.container.x, this.container.y, 30, 70, { 
			label: "wallBumper_sensor",
			isStatic: true,
			isSensor: true
		});
		collider.MACHINEMAN1357_wallBumper = this;
	}

	on_hitByBall() {
		if(this.isPushedIn === false) {
			const self = this;
			this.isPushedIn = true;
	
			on_sideBumperHit();
	
			this.tube.x = onHitMoveLeft;
			setTimeout(() => {
				self.resetPushedIn();
			}, timeBefore_resetPosFromLeft);
		}
	}

	resetPushedIn() {
		this.isPushedIn = false;
		this.tube.x = 0;
	}
}