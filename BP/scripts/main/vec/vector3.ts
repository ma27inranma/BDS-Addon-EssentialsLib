import * as MC from '@minecraft/server';



export function add(a: MC.Vector3, b: MC.Vector3 | number): MC.Vector3 {
	if (typeof b === 'number') {
		return {x: a.x + b, y: a.y + b, z: a.z + b};
	}
	return {x: a.x + b.x, y: a.y + b.y, z: a.z + b.z};
}

export function sub(a: MC.Vector3, b: MC.Vector3 | number): MC.Vector3 {
	if (typeof b === 'number') {
		return {x: a.x - b, y: a.y - b, z: a.z - b};
	}
	return {x: a.x - b.x, y: a.y - b.y, z: a.z - b.z};
}

export function mul(a: MC.Vector3, b: MC.Vector3 | number): MC.Vector3 {
	if (typeof b === 'number') {
		return {x: a.x * b, y: a.y * b, z: a.z * b};
	}
	return {x: a.x * b.x, y: a.y * b.y, z: a.z * b.z};
}

export function div(a: MC.Vector3, b: MC.Vector3 | number): MC.Vector3 {
	if (typeof b === 'number') {
		return {x: a.x / b, y: a.y / b, z: a.z / b};
	}
	return {x: a.x / b.x, y: a.y / b.y, z: a.z / b.z};
}

export function len(a: MC.Vector3): number {
	return Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
}