import { COLLISION_CATEGORIES } from "./collisionCategories.js";
import { set_cursorElement } from "./debugElements.js";
import { isInputDown_leftPaddle, isInputDown_rightPaddle, setNewPaddlesInputContainerSize } from "./paddlesInput.js";
import { game } from "./phaserSetup.js";

let mainScene;

let ball;
const PADDLE_PULL = 0.00015;

export function preload () {
	this.load.atlas('bg', 'assets/images/bg.png', 'assets/images/bg.json');

	this.load.image("pinball", "./assets/images/pinball.png");
	this.load.image("paddle", "./assets/images/paddle.png");
	this.load.image("sun", "./assets/images/sun.png");

	// Load body shapes from JSON file generated using PhysicsEditor
    this.load.json('shapes', 'assets/json/testPhysicsShape.json');
}

export function create () {
	mainScene = this;

	mainScene.matter.world.setBounds();

	createMapObjects();

	mainScene.matter.add.mouseSpring();
	
	createPaddles();
	createPaddleStoppers();
	
	setUpEvents();
}

export function update () {
	
}

function createMapObjects() {
	// bg
	mainScene.add.image(0, 0, "bg", "Frame_15_medium")
		.setOrigin(0, 0)
		.setAlpha(0.1);
	
	// const ball_visual = this.add.sprite(0, 0, "ball").setDepth(1);
	// const ball_body = this.matter.add.circle(481, 788, 16);
	// ball = this.matter.add.gameObject(ball_visual, ball_body);

	createBall();

	// bg collider
	var shapes = mainScene.cache.json.get('shapes');
	mainScene.matter.add.sprite(350, 400, "bg", "Frame_15_medium", {shape: shapes.Frame_15_medium})
		// .setOrigin(0, 0)
		.setAlpha(0.0);
}

function createBall() {
	ball = mainScene.matter.add.image(481, 788, 'pinball', null, {
		shape: {
            type: 'circle',
            radius: 12
        }
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
}

function createPaddleStoppers() {
	// left
	createPaddleStopper(172, 845, "left", "down");
	createPaddleStopper(172, 714, "left", "up");

	// right
	createPaddleStopper(285, 845, "right", "down");
	createPaddleStopper(285, 714, "right", "up");
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
	createPaddle(180, 794, 154, 780, -25, -12, -1.5, "left");
	createPaddle(305, 794, 307, 780, 22, 18, 1.5, "right");
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