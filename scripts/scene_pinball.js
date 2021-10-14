import { aavegotchiHandWave_start } from "./aavegotchiHandWave.js";
import { arrows_start, tripleArrows_left, tripleArrows_right } from "./arrows.js";
import { COLLISION_CATEGORIES } from "./collisionCategories.js";
import { set_cursorElement } from "./debugElements.js";
import { isInputDown_leftPaddle, isInputDown_rightPaddle } from "./paddlesInput.js";
import { statsBar_start } from "./statsBar.js";
import { getNormalizedDirectionAndAngle, isCompareEitherOrBodies } from "./utils.js";

export let mainScene;

let ball;
let ballShootForceSensor_body;
let failResetSensor_body;
const PADDLE_PULL = 0.0005;
const ballShootPosition = [552, 777];
const playerBall_depth = 3;

// debug
const isCreateBGRef = false;

const bg_scrubbed_collisionShape = {
	x: 370,
	y: 460
};

export class PinballScene extends Phaser.Scene {
    constructor () {
        super('PinballScene');
    }

	preload() {
		this.load.atlas('bg_scrubbed', 'assets/images/bg_scrubbed.png', 'assets/images/bg_scrubbed.json');
		this.load.spritesheet('portal', 'assets/images/portal_spritesheet.png', { frameWidth: 706, frameHeight: 836 });
		this.load.spritesheet('ghst', 'assets/images/ghst_atlas.png', { frameWidth: 231, frameHeight: 231 });

		this.load.image("bg_ref", "./assets/images/bg_ref.png");
		this.load.image("pinball", "./assets/images/pinball.png");
		this.load.image("paddle", "./assets/images/paddle.png");
		this.load.image("aavegotchiHand", "./assets/images/aavegotchiHand_l_up.png");
		this.load.image("arrow_red", "./assets/images/arrow_red.png");
		this.load.image("arrow_purple", "./assets/images/arrow_purple.png");
		this.load.image("timer", "./assets/images/timer.png");

		// Load body shapes from JSON file generated using PhysicsEditor
		this.load.json('shapes', 'assets/json/bg_scrubbed.json');
	}

    create () {
        mainScene = this;

		// mainScene.scene.start('PlinkoScene');

		// mainScene.matter.world.setBounds();

		this.createMapObjects();

		mainScene.matter.add.mouseSpring();
		
		for (let i = 0; i < 1; i++) {
			this.createBall();
		}
		this.createPaddles();
		this.createPaddleStoppers();
		
		this.setUpEvents();
		this.adjustCamera();
		aavegotchiHandWave_start();
		this.create_portalAnimation();
		statsBar_start();
		arrows_start();
    }

	update() {
		// const cam = mainScene.cameras.main;
		// ass.x = game.input.activePointer.position.x / cam.zoom;
		// ass.y = game.input.activePointer.position.y / cam.zoom + 50;
		// console.log(ass.x, ass.y);
	}

	create_portalAnimation() {
		var config = {
			key: 'portalAnimation',
			frames: mainScene.anims.generateFrameNumbers('portal', { start: 0, end: 4, first: 0 }),
			frameRate: 10,
			repeat: -1
		};
	
		mainScene.anims.create(config);
		mainScene.add.sprite(415.7733498152892, 283.43273288908836, 'portal')
			.play('portalAnimation')
			.setScale(0.087);
	}
	
	adjustCamera() {
		mainScene.cameras.main.zoom = 0.85; // 0.85
		mainScene.cameras.main.setScroll(40, 80);
	}
	
	createMapObjects() {
		// bg
		const bg = mainScene.add.image(0, 0, "bg_scrubbed", "bg_scrubbed")
			.setOrigin(0, 0)
			// .setAlpha(0.1);
		bg.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
		
		// bg ref
		if(isCreateBGRef) {
			const bg_ref = mainScene.add.image(0, 0, "bg_ref")
				.setOrigin(0, 0)
				.setAlpha(0.5)
				.setDepth(2);
			bg_ref.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
		}
		
		// const ball_visual = this.add.sprite(0, 0, "ball").setDepth(1);
		// const ball_body = this.matter.add.circle(481, 788, 16);
		// ball = this.matter.add.gameObject(ball_visual, ball_body);
	
		// bg collider
		var shapes = mainScene.cache.json.get('shapes');
		const shapes_gameObject = mainScene.matter.add.sprite(bg_scrubbed_collisionShape.x, bg_scrubbed_collisionShape.y, "bg_scrubbed", "bg_scrubbed", {shape: shapes.bg_scrubbed})
			// .setOrigin(0, 0)
			.setAlpha(0.0);
		
		ballShootForceSensor_body = shapes_gameObject.body.parts.find(x => x.label === "ballShootForceSensor");
		failResetSensor_body = shapes_gameObject.body.parts.find(x => x.label === "failResetSensor");
	}
	
	createBall(x, y) {
		const xPos = x === undefined ? ballShootPosition[0] : x;
		const yPos = y === undefined ? ballShootPosition[1] : y;
	
		ball = mainScene.matter.add.image(xPos, yPos, 'pinball', null, {
			shape: {
				type: 'circle',
				radius: 12
			},
			label: "PlayerBall"
		}).setDepth(playerBall_depth);
		ball.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

		ball.setFriction(0.00001);
		ball.setBounce(0.3);
	
		ball.setCollisionCategory(COLLISION_CATEGORIES.BALL);
		ball.setCollidesWith([COLLISION_CATEGORIES.PADDLE, COLLISION_CATEGORIES.DEFAULT, COLLISION_CATEGORIES.BALL]);
	}
	
	setUpEvents() {
		mainScene.input.on('pointermove', function (pointer) {
			set_cursorElement(Math.round(pointer.x * 1000) / 1000, Math.round(pointer.y * 1000) / 1000);
		}, mainScene);
	
		// collision filtering
		mainScene.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
			mainScene.collisionFiltering(event, bodyA, bodyB);
		});
	}
	
	collisionFiltering(event, bodyA, bodyB) {
		// disabled this because it seems there's a bug where only one body is called when 2 bodies are in sensor simultaneously
		// const compareData_PB_BSFS = isCompareEitherOrBodies(bodyA.label, bodyB.label, "PlayerBall", "ballShootForceSensor", bodyA, bodyB);
		// const compareData_PB_FRS = isCompareEitherOrBodies(bodyA.label, bodyB.label, "PlayerBall", "failResetSensor", bodyA, bodyB);
		const compareData_PB_GHSTB = isCompareEitherOrBodies(bodyA.label, bodyB.label, "PlayerBall", "ghstBumper", bodyA, bodyB);
		const compareData_PB_TASL = isCompareEitherOrBodies(bodyA.label, bodyB.label, "PlayerBall", "tripleArrowSensor_left", bodyA, bodyB);
		const compareData_PB_TASR = isCompareEitherOrBodies(bodyA.label, bodyB.label, "PlayerBall", "tripleArrowSensor_right", bodyA, bodyB);
		const compareData_PB_PS = isCompareEitherOrBodies(bodyA.label, bodyB.label, "PlayerBall", "portalSensor", bodyA, bodyB);
	
		this.doBehaviour_checkIfAnyBallsAreIn_ballShootForceSensor();
		this.doBehaviour_checkIfAnyBallsAreIn_failResetSensor();
	
		/*if(compareData_PB_BSFS.isSuccess) {console.log("reset");
			compareData_PB_BSFS.firstBody.gameObject.setVelocity(0, -25 + Phaser.Math.Between(-2, 2));
		} else if(compareData_PB_FRS.isSuccess) {
			compareData_PB_FRS.firstBody.gameObject.setPosition(ballShootPosition[0], ballShootPosition[1]);
		} else */if(compareData_PB_GHSTB.isSuccess) {
			this.pushBodyAwayFrom(compareData_PB_GHSTB.firstBody, compareData_PB_GHSTB.secondBody, 5);
		} else if(compareData_PB_TASL.isSuccess) {
			tripleArrows_left.tripleArrows_onBallHit();
		} else if(compareData_PB_TASR.isSuccess) {
			tripleArrows_right.tripleArrows_onBallHit();
		} else if(compareData_PB_PS.isSuccess) {
			mainScene.scene.start('PlinkoScene');
		}
	}
	
	doBehaviour_checkIfAnyBallsAreIn_ballShootForceSensor() {
		const bodies = mainScene.matter.intersectBody(ballShootForceSensor_body);
		
		for (let i = 0, len = bodies.length; i < len; i++) {
			const body = bodies[i];
			
			if(body.label === "PlayerBall") {
				body.gameObject.setVelocity(0, -25 + Phaser.Math.Between(-2, 2));
			}
		}
	}
	
	doBehaviour_checkIfAnyBallsAreIn_failResetSensor() {
		const bodies = mainScene.matter.intersectBody(failResetSensor_body);
		
		for (let i = 0, len = bodies.length; i < len; i++) {
			const body = bodies[i];
			
			if(body.label === "PlayerBall") {
				body.gameObject.setPosition(ballShootPosition[0], ballShootPosition[1]);
			}
		}
	}
	
	pushBodyAwayFrom(bodyA, bodyB, force) {
		const posA = bodyA.position;
		const posB = bodyB.position;
	
		const normDir = getNormalizedDirectionAndAngle(posB.x, posB.y, posA.x, posA.y);
	
		bodyA.gameObject.setVelocity(normDir.x * force, normDir.y * force);
	}
	
	createPaddleStoppers() {
		// left
		// x: 198
		// y: 845
		this.createPaddleStopper(224, 970, "left", "down");
		this.createPaddleStopper(224, 824, "left", "up");
	
		// right
		this.createPaddleStopper(313, 970, "right", "down");
		this.createPaddleStopper(313, 824, "right", "up");
	}
	
	createPaddleStopper(x, y, side, position) {
		// determine which paddle composite to interact with
		let attracteeLabel = (side === 'left') ? 'paddleLeft' : 'paddleRight';
	
		const paddleStopper = mainScene.matter.add.circle(x, y, 32, {
			isStatic: true,
			plugin: {
				attractors: [
					// stopper is always a, other body is b
					function (bodyA, bodyB) {
						if (bodyB.label === attracteeLabel) {
							let isPaddleUp = (side === 'left') ? isInputDown_leftPaddle : isInputDown_rightPaddle;
							let isPullingUp = (position === 'up' && isPaddleUp);
							let isPullingDown = (position === 'down' && !isPaddleUp);
							if (isPullingUp || isPullingDown) {
								return {
									x: (bodyA.position.x - bodyB.position.x) * PADDLE_PULL,
									y: (bodyA.position.y - bodyB.position.y) * PADDLE_PULL,
								};
							}
						}
					}
				]
			}
		});
	
		paddleStopper.collisionFilter.category = COLLISION_CATEGORIES.ATTRACTOR;
		paddleStopper.collisionFilter.mask = COLLISION_CATEGORIES.PADDLE;
	}
	
	createPaddles() {
		// hingeX: 154
		// hingeY: 780
		this.createPaddle(180, 890, 187, 890, -25, -12, -1.75, "left");
	
		// hingeX: 307
		// hingeY: 780
		this.createPaddle(355, 890, 355, 890, 22, 18, 1.75, "right");
	}
	
	createPaddle(x, y, hingeX, hingeY, pointA, pointB, scale, side) {
		const paddle_visual = mainScene.add.sprite(0, 0, "paddle").setDepth(1).setScale(scale, Math.abs(scale));
		paddle_visual.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
		const paddle_body = mainScene.matter.add.trapezoid(x, y, 54 * Math.abs(scale), 19, 0, {
			chamfer: {},
			angle: 3.7,
			render: {
				sprite: {
					xOffset: 0
				}
			},
			label: (side === "left") ? "paddleLeft" : "paddleRight",
			// isStatic: true
		});
		const paddle = mainScene.matter.add.gameObject(paddle_visual, paddle_body);
	
		paddle.setCollisionCategory(COLLISION_CATEGORIES.PADDLE);
		paddle.setCollidesWith([COLLISION_CATEGORIES.ATTRACTOR, COLLISION_CATEGORIES.BALL]);
	
		// hinge
		const hinge = mainScene.matter.add.circle(hingeX, hingeY, 5, {
			isStatic: true
		});
		hinge.collisionFilter.group = COLLISION_CATEGORIES.HINGE;
	
		mainScene.matter.add.constraint(paddle_body, hinge, 0, 0, {
			pointA: { x: pointA, y: pointB },
		});
	
		return paddle;
	}
}