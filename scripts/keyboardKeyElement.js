export class KeyboardKeyElement {
	constructor(options) {
		this.keyText = options.keyText;
		this.parentEl = options.parentEl;

		this.createElement();
	}

	createElement() {
		const keyboardEl = document.createElement("div");
		keyboardEl.classList.add("keyboardKey_container");
		keyboardEl.innerHTML = this.keyText;
		this.parentEl.appendChild(keyboardEl);
	}
}