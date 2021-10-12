import { mainScene } from "./game.js";
import { game } from "./phaserSetup.js";
import { getMouseWorldPosition_phaser } from "./utils.js";

export let aavegotchiHandWave;

export function aavegotchiHandWave_start() {
	aavegotchiHandWave = new AavegotchiHandWave();
}

class AavegotchiHandWave {
	constructor() {
		this.handImage;
		this.handImage_scaleY = 1;
		this.handImage_lessYPositionWhenHandIsDown = 2;
		this.handImage_startY;

		this.aavegotchiHandWave_createSprite();
		this.aavegotchiHandWave_createHandFlipTween();
	}

	aavegotchiHandWave_update() {
		// this.aavegotchiHandWave_moveToMouse();
	}

	aavegotchiHandWave_createSprite() {
		this.handImage = mainScene.add.image(233.45926119908032, 622.6576402894877, "aavegotchiHand");
		this.handImage_startY = this.handImage.y;
	}

	aavegotchiHandWave_createHandFlipTween() {
		const self = this;

		var tween = mainScene.tweens.add({
			targets: this.handImage,
			x: this.handImage.x,
			ease: 'Power1',
			duration: 250,
			yoyo: true,
			repeat: -1,
			onYoyo: function () {
				self.handImage_scaleY *= -1;
				self.handImage.scaleY = self.handImage_scaleY;

				// move down?
				if(self.handImage_scaleY === -1) {
					self.handImage.y = self.handImage.y + self.handImage_lessYPositionWhenHandIsDown;
				} else {
					self.handImage.y = self.handImage_startY;
				}
			},
		});
	}

	aavegotchiHandWave_moveToMouse() {
		const worldPos = getMouseWorldPosition_phaser(mainScene);
		const cam = mainScene.cameras.main;
		this.handImage.x = game.input.activePointer.position.x / cam.zoom;
		this.handImage.y = game.input.activePointer.position.y / cam.zoom + 50;
		console.log(this.handImage.x, this.handImage.y);
	}
}