import { set_cursorElement } from "./debugElements.js";
import { game } from "./phaserSetup.js";

let mainScene;

let ball;
const PADDLE_PULL = 0.00002;

export function preload () {
	this.load.atlas('bg', 'assets/images/bg.png', 'assets/images/bg.json');

	this.load.image("ball", "./assets/images/ball.png");
	this.load.image("paddle", "./assets/images/paddle.png");
	this.load.image("sun", "./assets/images/sun.png");

	// Load body shapes from JSON file generated using PhysicsEditor
    this.load.json('shapes', 'assets/json/testPhysicsShape.json');
}

export function create () {
	mainScene = this;

	mainScene.matter.world.setBounds();

	mainScene.add.image(0, 0, "bg", "Frame_15_medium")
		.setOrigin(0, 0)
		.setAlpha(0.1);
	
	// const ball_visual = this.add.sprite(0, 0, "ball").setDepth(1);
	// const ball_body = this.matter.add.circle(481, 788, 16);
	// ball = this.matter.add.gameObject(ball_visual, ball_body);

	ball = mainScene.matter.add.image(481, 788, 'ball').setDepth(1);
	ball.setCircle();
	ball.setFriction(0.0001);
	ball.setBounce(0.1);

	mainScene.matter.add.mouseSpring();

	var shapes = mainScene.cache.json.get('shapes');
	mainScene.matter.add.sprite(350, 400, "bg", "Frame_15_medium", {shape: shapes.Frame_15_medium})
		// .setOrigin(0, 0)
		.setAlpha(0.0);
	
	createPaddles();

	mainScene.input.on('pointermove', function (pointer) {
		set_cursorElement(Math.round(pointer.x * 1000) / 1000, Math.round(pointer.y * 1000) / 1000);
	}, mainScene);

	// createAttractor();
}

export function update () {
	
}

function createAttractor() {
	var sun = mainScene.matter.add.image(244, 323, 'sun', null, {
        shape: {
            type: 'circle',
            radius: 64
        },
        plugin: {
            attractors: [
                function (bodyA, bodyB) {
                    return {
                        x: (bodyA.position.x - bodyB.position.x) * PADDLE_PULL,
                        y: (bodyA.position.y - bodyB.position.y) * PADDLE_PULL
                    };
                }
            ]
        }
    });
	sun.setDepth(1)
}

function createPaddles() {
	const leftPaddle_group = {
		paddle: undefined
	};
	leftPaddle_group.paddle = createPaddle(160, 780, 1.5, 1);

	createPaddle(305, 780, -1.5, -1);
}

function createPaddle(x, y, scale, sign) {
	const paddle_visual = mainScene.add.sprite(0, 0, "paddle").setDepth(1).setScale(scale, Math.abs(scale));
	const paddle_body = mainScene.matter.add.trapezoid(x, y, 54 * Math.abs(scale), 19, 0, {
		chamfer: {},
		angle: 1.57,
		render: {
			sprite: {
				xOffset: 0
			}
		}
	});
	const paddle = mainScene.matter.add.gameObject(paddle_visual, paddle_body);

	mainScene.matter.add.worldConstraint(paddle, 0, 0, {
		pointA: { x: x, y: y }, 
		pointB: { x: 0, y: -25 * sign }
	});

	return paddle;
}