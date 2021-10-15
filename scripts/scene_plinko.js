import { COLLISION_CATEGORIES } from "./collisionCategories.js";
import { ballsUnlockedForPlinko } from "./game.js";
import { game } from "./phaserSetup.js";

const ghst_scale = 0.25;
const spinCoin_scale = 0.4;
const isCreateBGRef = false;
const playerBall_depth = 2;

export class PlinkoScene extends Phaser.Scene {
    constructor () {
        super('PlinkoScene');
    }

    preload() {
        this.load.image("bgPlinkoRef", "./assets/images/plinko-scene/bgPlinkoRef.png");
		this.load.image("tube_bgColor", "./assets/images/plinko-scene/tube_bgColor.png");
		this.load.image("tube_outline", "./assets/images/plinko-scene/tube_outline.png");
		this.load.image("spin_coin_2", "./assets/images/spin_coin_2.png");
    }

	create() {
		this.setUp_ghstAnimation();
		this.cameras.main.setBackgroundColor('#bb358e');
		this.create_sceneObjects();

		this.create_balls();
		this.matter.add.mouseSpring();
		this.matter.world.setBounds();
    }

	update() {
        
    }

	create_balls() {
		const distanceFromTop = 50;
		const extraWidth = 0;
		const spacing = (game.scale.width + extraWidth) / ballsUnlockedForPlinko;
		for (let i = 0; i < ballsUnlockedForPlinko; i++) {
			const xPos = spacing * i + spacing / 2 - extraWidth / 2;
			this.createBall(xPos, distanceFromTop);
		}
	}

	create_sceneObjects() {
		this.create_tubes();

		// bg ref
		if(isCreateBGRef) {
			this.add.image(game.scale.width / 2, game.scale.height / 2, "bgPlinkoRef")
				.setScale(1.4)
				.setAlpha(0.5);

		}
		this.create_ghsts();

		const bottomBlueRectangle = this.add.rectangle(
			game.scale.width / 2,
			game.scale.height,
			game.scale.width + 10,
			315,
			0x32d2d4);
	}

	createBall(xPos, yPos) {
		const ball = this.matter.add.image(xPos, yPos, 'pinball', null, {
			shape: {
				type: 'circle',
				radius: 12
			},
			label: "PlayerBall"
		}).setDepth(playerBall_depth);
		ball.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

		ball.setFriction(0.0);
		ball.setBounce(0.5);
	
		ball.setCollisionCategory(COLLISION_CATEGORIES.BALL);
		ball.setCollidesWith([COLLISION_CATEGORIES.PADDLE, COLLISION_CATEGORIES.DEFAULT, COLLISION_CATEGORIES.BALL]);
	}

	setUp_ghstAnimation() {
		var config = {
			key: 'ghstAnimation',
			frames: this.anims.generateFrameNumbers('ghst', { start: 0, end: 10, first: 0 }),
			frameRate: 10,
			repeat: -1
		};
	
		this.anims.create(config);
	}

	create_ghstOrCoin(xPos, yPos, texture, scale) {
		const object_visual = this.add.sprite(0, 0, texture).setDepth(5).setScale(scale);
		object_visual.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

		const object_body = this.matter.add.circle(xPos, yPos, 20, {
			isStatic: true
		});
		const paddle = this.matter.add.gameObject(object_visual, object_body);
	}

	create_ghsts() {
		const rows = 6;
		let isSix = true;
		const extraWidth = -70;
		const spacing = (game.scale.width + extraWidth) / 6;
		const ySpacing = 95;
		const extraY = 75;
		const ghstBumperIndices = [17, 23, 26];

		let created = 0;
		for (let r = 0; r < rows; r++) {
			const columns = isSix === true ? 6 : 5;

			for (let c = 0; c < columns; c++) {
				let xPos = spacing * c + spacing / 2 - extraWidth / 2;
				if(columns === 5) {
					const fiveSpacing = (game.scale.width + extraWidth) / 5;
					xPos += fiveSpacing / 2;
				}

				created += 1;

				if(ghstBumperIndices.includes(created)) {
					this.create_ghstOrCoin(xPos, r * ySpacing + extraY, "ghst", ghst_scale);
				} else {
					this.create_ghstOrCoin(xPos, r * ySpacing + extraY, 'spin_coin_2', spinCoin_scale);
				}
			}

			isSix = !isSix;
		}
	}

	create_tubes() {
		const tubeScale = 1.5;
		const extraWidth = -50;
		const spacing = (game.scale.width + extraWidth) / 4;
		const yPos = game.scale.height - 77;
		const colors = [0xcd25a1, 0x0061ff, 0xffd503, 0x37a961];

		for (let i = 0; i < 4; i++) {
			const xPos = spacing * i + spacing / 2 - extraWidth / 2;
			const color = colors[i];

			const tube_bgColor = this.add.image(xPos, yPos, "tube_bgColor")
				.setDepth(1)
				.setTint(color)
				.setScale(tubeScale);
			tube_bgColor.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
			
			const tube_outline = this.add.image(xPos, yPos, "tube_outline")
				.setDepth(1)
				.setScale(tubeScale);
			tube_outline.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
		}
	}
}