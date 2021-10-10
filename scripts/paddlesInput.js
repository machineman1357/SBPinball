import { KeyboardKeyElement } from "./keyboardKeyElement.js";
import { game } from "./phaserSetup.js";

const paddlesInput_groups = {
	left: {
		element: undefined,
		keyboardKeys_container: undefined
	},
	right: {
		element: undefined,
		keyboardKeys_container: undefined
	}
};
const paddleKeyCodeInputs_left = ["KeyA", "ArrowLeft"];
const paddleKeyCodeInputs_right = ["KeyD", "ArrowRight"];

export let isInputDown_leftPaddle = false;
export let isInputDown_rightPaddle = false;

let ref_paddlesInput_container;

export function paddlesInput_start() {
	setRefs();
	setUpEvents();
	createKeyboardKeysElements();
}

export function setNewPaddlesInputContainerSize() {
	const canvasRect = game.canvas.getBoundingClientRect();
	const twoTimesPaddleInputsSize = 100 * 2;

	ref_paddlesInput_container.style.width = canvasRect.width + twoTimesPaddleInputsSize + "px";
}

function createKeyboardKeysElements() {
	// left
	new KeyboardKeyElement({
		keyText: "A",
		parentEl: paddlesInput_groups.left.keyboardKeys_container
	});
	new KeyboardKeyElement({
		keyText: "←",
		parentEl: paddlesInput_groups.left.keyboardKeys_container
	});

	// right
	new KeyboardKeyElement({
		keyText: "D",
		parentEl: paddlesInput_groups.right.keyboardKeys_container
	});
	new KeyboardKeyElement({
		keyText: "→",
		parentEl: paddlesInput_groups.right.keyboardKeys_container
	});
}

function setRefs() {
	paddlesInput_groups.left.element = document.querySelector("#paddlesInput_button_left");
	paddlesInput_groups.left.keyboardKeys_container = paddlesInput_groups.left.element.querySelector(".keyboardKeys_container");

	paddlesInput_groups.right.element = document.querySelector("#paddlesInput_button_right");
	paddlesInput_groups.right.keyboardKeys_container = paddlesInput_groups.right.element.querySelector(".keyboardKeys_container");

	ref_paddlesInput_container = document.querySelector("#paddlesInput_container");
}

function setUpEvents() {
	paddlesInputButtonsEvents();
}

function paddlesInputButtonsEvents() {
	const paddlesInput_groups_keys = Object.keys(paddlesInput_groups);
	// pointer
	for (let i = 0, len = paddlesInput_groups_keys.length; i < len; i++) {
		const paddlesInput_groups_key = paddlesInput_groups_keys[i];
		const paddlesInput_group = paddlesInput_groups[paddlesInput_groups_key];
		
		paddlesInput_group.element.addEventListener("pointerdown", function() {
			setState_PaddlesInput("ON", paddlesInput_groups_key);
		});
	
		paddlesInput_group.element.addEventListener("pointerup", function() {
			setState_PaddlesInput("OFF", paddlesInput_groups_key);
		});
	}

	// keys
	// down
	document.body.addEventListener("keydown", function(ev) {
		// left
		if(paddleKeyCodeInputs_left.includes(ev.code)) {
			setState_PaddlesInput("ON", "left");

			isInputDown_leftPaddle = true;
		}

		// right
		if(paddleKeyCodeInputs_right.includes(ev.code)) {
			setState_PaddlesInput("ON", "right");

			isInputDown_rightPaddle = true;
		}
	});

	// up
	document.body.addEventListener("keyup", function(ev) {
		// left
		if(paddleKeyCodeInputs_left.includes(ev.code)) {
			setState_PaddlesInput("OFF", "left");

			isInputDown_leftPaddle = false;
		}
		
		// right
		if(paddleKeyCodeInputs_right.includes(ev.code)) {
			setState_PaddlesInput("OFF", "right");

			isInputDown_rightPaddle = false;
		}
	});
}

function setState_PaddlesInput(state, paddlesInput_groupName) {
	const paddlesInput_group = paddlesInput_groups[paddlesInput_groupName];

	if(state === "ON") {
		paddlesInput_group.element.classList.add("paddlesInput_button_active");
	} else if(state === "OFF") {
		paddlesInput_group.element.classList.remove("paddlesInput_button_active");
	}
}