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

export function lenSq(a: MC.Vector3): number {
	return a.x * a.x + a.y * a.y + a.z * a.z;
}

export function dot(a: MC.Vector3, b: MC.Vector3): number {
	return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function normalize(a: MC.Vector3): MC.Vector3 {
	const l = len(a);
	if (l < 1e-12) return {x: 0, y: 0, z: 0};
	return {x: a.x / l, y: a.y / l, z: a.z / l};
}