import { game } from "./phaserSetup.js";

let ball;

export function preload () {
	this.load.atlas('bg', 'assets/images/bg.png', 'assets/images/bg.json');

	this.load.image("ball", "./assets/images/ball.png");

	// Load body shapes from JSON file generated using PhysicsEditor
    this.load.json('shapes', 'assets/json/testPhysicsShape.json');
}

export function create () {
	this.matter.world.setBounds();
	
	const ball_visual = this.add.sprite(0, 0, "ball").setDepth(1);
	const ball_body = this.matter.add.circle(481, 788, 16);
	ball = this.matter.add.gameObject(ball_visual, ball_body);

	this.matter.add.mouseSpring();

	var shapes = this.cache.json.get('shapes');
	this.matter.add.sprite(350, 400, "bg", "Frame_15_medium", {shape: shapes.Frame_15_medium})
		// .setOrigin(0, 0)
		// .setAlpha(0.25);
}

export function update () {
	
}

function createLineZoneColliders() {

}