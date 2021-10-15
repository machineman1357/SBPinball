import { game } from "./phaserSetup.js";

export function getMouseWorldPosition_phaser(mainScene) {
	if(mainScene && game) {
		const cam = mainScene.cameras.main;
		const linePosX = (game.input.activePointer.position.x - (window.innerWidth / 2)) / cam.zoom + cam.midPoint.x;
		const linePosY = (game.input.activePointer.position.y - (window.innerHeight / 2)) / cam.zoom + cam.midPoint.y;
	
		return { x: linePosX, y: linePosY };
	} else {
		console.warn("mainScene or game is undefined");
	}
}

export function getNormalizedDirectionAndAngle(x1, y1, x2, y2) {
	const dirX = x2 - x1;
	const dirY = y2 - y1;

	let length = Math.sqrt(dirX * dirX + dirY * dirY);
	if(length === 0) { length = 1; }

	const ndx = dirX / length;	// x normalized
    const ndy = dirY / length;

	const angle = Math.atan2(ndx, ndy);

	return { x: ndx, y: ndy, angle: angle};
}

// check if the inputted names (nameA & nameB) match the must be names in either order, and return the order of the matched names
export function isCompareEitherOrBodies(nameA, nameB, nameAMustBe, nameBMustBe, bodyA, bodyB) {
	if(nameA === nameAMustBe && nameB === nameBMustBe) {
		return {
			isSuccess: true,
			firstBody: bodyA,
			secondBody: bodyB
		};
	};

	if(nameA === nameBMustBe && nameB === nameAMustBe) {
		return {
			isSuccess: true,
			firstBody: bodyB,
			secondBody: bodyA
		};
	}

	return {
		isSuccess: false
	};
}

export function isAngleBetweenAngles(facingAngle_deg, angleOfTarget_deg, angleWithin_deg) {
	const anglediff = (facingAngle_deg - angleOfTarget_deg + 180 + 360) % 360 - 180

	if (anglediff <= angleWithin_deg && anglediff >= -angleWithin_deg) {
		return true;
	} else {
		return false;
	}
}