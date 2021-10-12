import { aavegotchiHandWave, aavegotchiHandWave_start } from "./aavegotchiHandWave.js";
import { COLLISION_CATEGORIES } from "./collisionCategories.js";
import { set_cursorElement } from "./debugElements.js";
import { isInputDown_leftPaddle, isInputDown_rightPaddle, setNewPaddlesInputContainerSize } from "./paddlesInput.js";

export let mainScene;

let ball;
const PADDLE_PULL = 0.0005;
const ballShootPosition = [552, 777];

const bg_scrubbed_collisionShape = {
	x: 385,
	y: 480
}

export function preload () {
	this.load.atlas('bg_scrubbed', 'assets/images/bg_scrubbed.png', 'assets/images/bg_scrubbed.json');

	this.load.image("bg_ref", "./assets/images/bg_ref.png");
	this.load.image("pinball", "./assets/images/pinball.png");
	this.load.image("paddle", "./assets/images/paddle.png");
	this.load.image("aavegotchiHand", "./assets/images/aavegotchiHand_l_up.png");

	// Load body shapes from JSON file generated using PhysicsEditor
    this.load.json('shapes', 'assets/json/bg_scrubbed.json');
}

export function create () {
	mainScene = this;

	// mainScene.matter.world.setBounds();

	createMapObjects();

	mainScene.matter.add.mouseSpring();
	
	createPaddles();
	createPaddleStoppers();
	
	setUpEvents();
	adjustCamera();
	aavegotchiHandWave_start();
}

export function update () {
	aavegotchiHandWave.aavegotchiHandWave_update();
}

// check if the inputted names (nameA & nameB) match the must be names in either order, and return the order of the matched names
function isCompareEitherOr(nameA, nameB, nameAMustBe, nameBMustBe) {
	if(nameA === nameAMustBe && nameB === nameBMustBe) {
		return {
			isSuccess: true,
			nameA: nameAMustBe,
			nameB: nameBMustBe
		};
	};

	if(nameA === nameBMustBe && nameB === nameAMustBe) {
		return {
			isSuccess: true,
			nameA: nameBMustBe,
			nameB: nameAMustBe
		};
	}

	return {
		isSuccess: false
	};
}

function adjustCamera() {
	mainScene.cameras.main.zoom = 0.87;
	mainScene.cameras.main.setScroll(40, 50);
}

function createMapObjects() {
	// bg
	mainScene.add.image(0, 0, "bg_scrubbed", "bg_scrubbed")
		.setOrigin(0, 0)
		// .setAlpha(0.1);
	
	// bg ref
	// mainScene.add.image(0, 0, "bg_ref")
	// 	.setOrigin(0, 0)
	// 	.setAlpha(0.5)
	// 	.setDepth(2);
	
	// const ball_visual = this.add.sprite(0, 0, "ball").setDepth(1);
	// const ball_body = this.matter.add.circle(481, 788, 16);
	// ball = this.matter.add.gameObject(ball_visual, ball_body);

	createBall();

	// bg collider
	var shapes = mainScene.cache.json.get('shapes');
	mainScene.matter.add.sprite(bg_scrubbed_collisionShape.x, bg_scrubbed_collisionShape.y, "bg_scrubbed", "bg_scrubbed", {shape: shapes.bg_scrubbed})
		// .setOrigin(0, 0)
		.setAlpha(0.0);
}

function createBall() {
	ball = mainScene.matter.add.image(ballShootPosition[0], ballShootPosition[1], 'pinball', null, {
		shape: {
            type: 'circle',
            radius: 12
        },
		label: "PlayerBall"
	}).setDepth(1);
	ball.setFriction(0.0001);
	ball.setBounce(0.1);

	ball.setCollisionCategory(COLLISION_CATEGORIES.BALL);
	ball.setCollidesWith([COLLISION_CATEGORIES.PADDLE, COLLISION_CATEGORIES.DEFAULT]);
}

function setUpEvents() {
	mainScene.input.on('pointermove', function (pointer) {
		set_cursorElement(Math.round(pointer.x * 1000) / 1000, Math.round(pointer.y * 1000) / 1000);
	}, mainScene);

	window.onresize = function() {
		setNewPaddlesInputContainerSize();
	}

	// shoot playerball up if sensed by ball shooter force sensor
	mainScene.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
		const compareData_PB_BSFS = isCompareEitherOr(bodyA.label, bodyB.label, "PlayerBall", "ballShootForceSensor");
		const compareData_PB_FRS = isCompareEitherOr(bodyA.label, bodyB.label, "PlayerBall", "failResetSensor");

		if(compareData_PB_BSFS.isSuccess) {
			ball.setVelocity(0, -25 + Phaser.Math.Between(-2, 2));
		} else if(compareData_PB_FRS.isSuccess) {
			ball.setPosition(ballShootPosition[0], ballShootPosition[1]);
		}
	});
}

function createPaddleStoppers() {
	// left
	// x: 198
	// y: 845
	createPaddleStopper(224, 970, "left", "down");
	createPaddleStopper(224, 824, "left", "up");

	// right
	createPaddleStopper(313, 970, "right", "down");
	createPaddleStopper(313, 824, "right", "up");
}

function createPaddleStopper(x, y, side, position) {
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

function createPaddles() {
	// hingeX: 154
	// hingeY: 780
	createPaddle(180, 890, 187, 890, -25, -12, -1.75, "left");

	// hingeX: 307
	// hingeY: 780
	createPaddle(355, 890, 355, 890, 22, 18, 1.75, "right");
}

function createPaddle(x, y, hingeX, hingeY, pointA, pointB, scale, side) {
	const paddle_visual = mainScene.add.sprite(0, 0, "paddle").setDepth(1).setScale(scale, Math.abs(scale));
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