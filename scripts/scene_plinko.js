import { BallFollowingRedRing } from "./ballFollowingRedRing.js";
import { BallGoingInTube } from "./ballGoingInTube.js";
import { COLLISION_CATEGORIES } from "./collisionCategories.js";
import { config } from "./config.js";
import { ballsUnlockedForPlinko } from "./game.js";
import { disable_paddlesInput } from "./paddlesInput.js";
import { game } from "./phaserSetup.js";
import { increaseScore } from "./stats.js";
import { isCompareEitherOrBodies, pushBodyAwayFrom } from "./utils.js";

let plinkoScene;

const ghst_scale = 0.25;
const spinCoin_scale = 0.4;
const isCreateBGRef = false;
const playerBall_depth = 2;

export let redRing_go;
const redRingData = {
	posX: 0
};
let ballsFollowingRedRing = [];
let ballsGoingInTubes = [];
let ghstAndCoins = [];
let ballKiller_body;
let isChangingScene = false;

let ballsNeededToFinishLevel;
let ballsCompleted = 0;

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
		this.resetStuff();

		plinkoScene = this;

		this.setUp_ghstAnimation();
		this.cameras.main.setBackgroundColor('#bb358e');
		this.create_sceneObjects();

		console.log(ballsUnlockedForPlinko);
		ballsNeededToFinishLevel = ballsUnlockedForPlinko;
		this.create_balls();
		this.matter.add.mouseSpring();
		this.matter.world.setBounds();
		this.setUp_events();
		this.create_tubeColliders();
		disable_paddlesInput();
		this.create_bottomBallKillerCollider();
    }

	update() {
		if(!isChangingScene) {
			if(redRing_go) redRing_go.setPosition(redRingData.posX, game.scale.height - 198);

			// update balls following red ring
			for (let i = 0, len = ballsFollowingRedRing.length; i < len; i++) {
				const ballFollowingRedRing = ballsFollowingRedRing[i];
				
				ballFollowingRedRing.update();
			}
	
			// update balls going in tubes
			for (let i = 0, len = ballsGoingInTubes.length; i < len; i++) {
				const ballGoingInTube = ballsGoingInTubes[i];
				
				ballGoingInTube.update();
			}
	
			// update balls going in tubes
			for (let i = 0, len = ghstAndCoins.length; i < len; i++) {
				const ghstOrCoin = ghstAndCoins[i];
				
				ghstOrCoin.rotation += 0.01;
			}
		}
    }

	resetStuff() {
		isChangingScene = false;
		ballsFollowingRedRing = [];
		ballsGoingInTubes = [];
		ghstAndCoins = [];
		redRing_go = undefined;
		ballKiller_body = undefined;
		ballsNeededToFinishLevel = undefined;
		ballsCompleted = 0;
	}

	setUp_events() {
		const self = this;

		// collision filtering
		this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
			self.collisionFiltering(event, bodyA, bodyB);
		});
	}

	collisionFiltering(event, bodyA, bodyB) {
		const compareData_PB_GHSTB = isCompareEitherOrBodies(bodyA.label, bodyB.label, "PlayerBall", "ghstBumper", bodyA, bodyB);
		const compareData_PB_RR = isCompareEitherOrBodies(bodyA.label, bodyB.label, "PlayerBall", "redRing", bodyA, bodyB);
		const compareData_PB_T = isCompareEitherOrBodies(bodyA.label, bodyB.label, "PlayerBall", "tube", bodyA, bodyB);

		this.doBehaviour_forAllBodiesWithLabelIntersectingBody("PlayerBall", this.killBall, ballKiller_body);

		if(compareData_PB_GHSTB.isSuccess) {
			pushBodyAwayFrom(compareData_PB_GHSTB.firstBody, compareData_PB_GHSTB.secondBody, 5);
			increaseScore(config.score.ghstBumper);
		} else if(compareData_PB_RR.isSuccess) {
			this.moveBallDownRedRing(compareData_PB_RR.firstBody);
			increaseScore(config.score.redRing);
			this.createScoreText(1000, compareData_PB_RR.secondBody.gameObject.x, compareData_PB_RR.secondBody.gameObject.y);
		} else if(compareData_PB_T.isSuccess) {
			this.moveBallDownTube(compareData_PB_T.firstBody, compareData_PB_T.secondBody);

			const tubeName = compareData_PB_T.secondBody.MACHINEMAN1357_tubeName;
			let scoreAmount = -1;

			if(tubeName === "purple") {
				scoreAmount = config.score.purpleTube;
			} else if(tubeName === "blue") {
				scoreAmount = config.score.blueTube;
			} else if(tubeName === "yellow") {
				scoreAmount = config.score.yellowTube;
			} else if(tubeName === "green") {
				scoreAmount = config.score.greenTube;
			}

			// shared
			increaseScore(scoreAmount);
			this.createScoreText(scoreAmount, compareData_PB_T.secondBody.position.x, compareData_PB_T.secondBody.position.y);
		}
	}

	killBall(ball_body) {
		if(!ball_body.gameObject.MACHINEMAN1357_isKilled) {
			ball_body.gameObject.setCollisionCategory(-1); // this makes it collide with nothing
			ball_body.gameObject.setStatic(true);
			ball_body.collisionFilter.mask = 0;
			ball_body.gameObject.MACHINEMAN1357_isKilled = true;
			ball_body.gameObject.alpha = 0;

			plinkoScene.completeBall();

			plinkoScene.createScoreText("☠️", ball_body.gameObject.x, ball_body.gameObject.y, 20);
		}
	}

	completeBall() {
		ballsCompleted += 1;
		const ballsLeft = ballsNeededToFinishLevel - ballsCompleted;

		console.log("+1 ball completed. Still need " + ballsLeft + " more.");
		if(ballsCompleted === ballsNeededToFinishLevel) {
			console.log("All balls completed!");

			setTimeout(() => {
				isChangingScene = true;
				this.scene.start('PinballScene');
			}, config.scene_plinko.timeBefore_endOfSceneToPinballSwitch_ms);
		}
	}

	doBehaviour_forAllBodiesWithLabelIntersectingBody(label, func, sensor_body) {
		const bodies = this.matter.intersectBody(sensor_body);
		
		for (let i = 0, len = bodies.length; i < len; i++) {
			const body = bodies[i];
			
			if(body.label === label) {
				func(body);
			}
		}
	}

	createScoreText(text, xPos, yPos, fontSize) {
		const text_go = this.add.text(xPos, yPos, text, { fontFamily: "Arial Black", fontSize: fontSize || 40 });
		text_go.setStroke('#000000', 4);
		text_go.setDepth(10);
		text_go.setOrigin(0.5, 0.5);
		//  Apply the gradient fill.
		const gradient = text_go.context.createLinearGradient(0, 0, 0, text_go.height);
		gradient.addColorStop(0, '#111111');
		gradient.addColorStop(.5, '#ffffff');
		gradient.addColorStop(.5, '#aaaaaa');
		gradient.addColorStop(1, '#111111');

		text_go.setFill(gradient);

		var tween = this.tweens.add({
			targets: text_go,
			y: {
				from: yPos,
				to: yPos - 50,
				duration: 1000,
				ease: 'Sine.easeInOut',
			},
			alpha: {
				from: 1,
				to: 0,
				duration: 1000,
				ease: 'Sine.easeInOut',
			}
		});
	}

	moveBallDownRedRing(ball_body) {
		ball_body.gameObject.setCollisionCategory(0); // thism akes it collide with nothing
		ball_body.gameObject.setStatic(true);

		const bfrr = new BallFollowingRedRing({
			ball_body: ball_body
		});
		ballsFollowingRedRing.push(bfrr);

		plinkoScene.completeBall();
	}

	moveBallDownTube(ball_body, tube_body) {
		ball_body.gameObject.setCollisionCategory(0); // thism akes it collide with nothing
		ball_body.gameObject.setStatic(true);

		const bgit = new BallGoingInTube({
			ball_body: ball_body,
			tube_body: tube_body
		});
		ballsGoingInTubes.push(bgit);

		plinkoScene.completeBall();
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
		// this.create_tubes();

		// bg ref
		if(isCreateBGRef) {
			this.add.image(game.scale.width / 2, game.scale.height / 2, "bgPlinkoRef")
				.setScale(1.4)
				.setAlpha(0.5);

		}
		this.create_ghsts();

		this.add.image(game.scale.width / 2, game.scale.height / 2, "plinko_universeBG");
		const bottomBlueRectangle = this.add.rectangle(
			game.scale.width / 2,
			game.scale.height,
			game.scale.width + 10,
			360,
			0x32d2d4);
		
		this.create_redRing();
		this.add.image(game.scale.width / 2, game.scale.height - 113, "plinko_tubesAndGridBG").setScale(0.332);
		this.add.image(game.scale.width / 2, game.scale.height - 113, "plinko_tubes").setScale(0.332).setDepth(11); // put tubes ontop
		this.add.image(game.scale.width / 2, game.scale.height / 2, "plinko_border");
	}

	createBall(xPos, yPos) {
		const ball = this.matter.add.image(xPos, yPos, 'pinball', null, {
			shape: {
				type: 'circle',
				radius: 18
			},
			label: "PlayerBall"
		}).setDepth(playerBall_depth);
		ball.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
		ball.scale = 1.5;

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
		// this visual will be static: just sit there, looking pretty
		const object_visual = this.add.sprite(xPos, yPos, texture).setDepth(5).setScale(scale);
		object_visual.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

		// THIS visual will be tied to the body by adding it to a gameobject and making it invisible, because it will be rotating (to circumnavigate the issue of balls idling ontop of them) and the sprite rotates with it, but having a separate one fixes this.
		const object_visual_forBody = this.add.sprite(xPos, yPos, texture).setAlpha(0);

		const object_body = this.matter.add.circle(xPos, yPos, 20, {
			isStatic: true,
			label: texture === "ghst" ? "ghstBumper" : "coin"
		});
		const ghstOrCoin_go = this.matter.add.gameObject(object_visual_forBody, object_body);
		ghstAndCoins.push(ghstOrCoin_go);
	}

	create_ghsts() {
		const rows = 8;
		let isSix = true;
		const extraWidth = -50;
		const spacing = (game.scale.width + extraWidth) / 6;
		const ySpacing = 70;
		const extraY = 75;
		const ghstBumperIndices = [11, 13, 26, 28, 34, 43];

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

	create_redRing() {
		const img = this.add.image(0, 0, "redRing").setScale(1.4).setDepth(10);
		img.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

		const collider = this.matter.add.rectangle(game.scale.width / 2, game.scale.height - 198, 67, 25, {
			label: "redRing",
			isStatic: true
		});

		redRing_go = this.matter.add.gameObject(img, collider);

		var tween = this.tweens.add({
			targets: redRingData,
			posX: {
				from: 50,
				to: game.scale.width - 50
			},
			duration: 2000,
			ease: 'Sine.easeInOut',
			yoyo: true,
			repeat: -1
		});
	}

	create_tubeColliders() {
		const tubeDatas = [
			{
				name: "purple",
				xPos: 95
			},
			{
				name: "blue",
				xPos: 230
			},
			{
				name: "yellow",
				xPos: 367
			},
			{
				name: "green",
				xPos: 490
			}
		];

		for (let i = 0; i < tubeDatas.length; i++) {
			const tubeData = tubeDatas[i];

			const collider = this.matter.add.rectangle(tubeData.xPos, game.scale.height - 152, 67, 25, {
				label: "tube",
				isStatic: true
			});
			collider.MACHINEMAN1357_tubeName = tubeData.name;
		}
	}

	create_bottomBallKillerCollider() {
		ballKiller_body = this.matter.add.rectangle(game.scale.width / 2, game.scale.height, game.scale.width, 200, {
			label: "ballKiller",
			isStatic: true,
			isSensor: true
		});
	}
}