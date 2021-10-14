import { increase_ballsUnlockedForPlinko } from "./game.js";
import { game } from "./phaserSetup.js";
import { mainScene } from "./scene_pinball.js";

export let tripleArrows_left;
export let tripleArrows_right;

export function arrows_start() {
	tripleArrows_left = new TripleArrows({
		xPos: 103.065,
		yPos: 524.32,
		angle: -28
	});
	tripleArrows_right = new TripleArrows({
		xPos: 433.9,
		yPos: 523.14,
		angle: 28
	});
}

class TripleArrows {
	constructor(options) {
		this.arrowsContainer;
		this.arrowSprites = [];
		this.arrowSpritesTaken = 0;

		this.xPos = options.xPos;
		this.yPos = options.yPos;
		this.angle = options.angle;

		this.tripleArrows_create();
	}

	tripleArrows_create() {
		const arrowHeight = 26;

		this.arrowsContainer = mainScene.add.container(this.xPos, this.yPos)
			.setDepth(2)
			.setScale(1.5)
			.setAngle(this.angle);

		for (let i = 0; i < 3; i++) {
			const arrow = mainScene.add.image(0, arrowHeight * i, "arrow_red");
			arrow.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
			
			this.arrowsContainer.add(arrow);
			this.arrowSprites.push(arrow);
		}
	}

	tripleArrows_update() {
		// this.tripleArrows_moveToMouse();
	}

	tripleArrows_moveToMouse() {
		const cam = mainScene.cameras.main;
		this.arrowsContainer.x = game.input.activePointer.position.x / cam.zoom;
		this.arrowsContainer.y = game.input.activePointer.position.y / cam.zoom + 50;
		console.log(this.arrowsContainer.x, this.arrowsContainer.y);
	}

	tripleArrows_onBallHit() {
		// only decrement if all the arrows haven't been taken
		if(this.arrowSpritesTaken < this.arrowSprites.length) {
			increase_ballsUnlockedForPlinko();

			this.arrowSpritesTaken += 1;
			const asti = this.tripleArrows_getArrowSpriteTakenIndex();
	
			this.arrowSprites[asti].setTexture("arrow_purple");
			this.tripleArrows_addTimerSpriteToArrow();
		}
	}

	tripleArrows_getArrowSpriteTakenIndex() {
		return this.arrowSprites.length - this.arrowSpritesTaken;
	}

	tripleArrows_addTimerSpriteToArrow() {
		const asti = this.tripleArrows_getArrowSpriteTakenIndex();
		const timerSprite = mainScene.add.image(this.arrowSprites[asti].x, this.arrowSprites[asti].y + 3, "timer")
			.setAngle(-this.angle)
			.setScale(0.75);
		timerSprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
		this.arrowsContainer.add(timerSprite);
	}
}