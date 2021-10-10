let ref_debugElements_container;

// Elements
let ref_cursorElement;

export function debugElements_start() {
	ref_debugElements_container = document.querySelector("#debugElements_container");
}

export function set_cursorElement(x, y) {
	if(ref_cursorElement === undefined) {
		ref_cursorElement = document.createElement("div");
		ref_debugElements_container.appendChild(ref_cursorElement);
	}

	ref_cursorElement.innerHTML = "cursor: " + x + ", " + y;
}