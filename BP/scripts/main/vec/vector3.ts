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

export function toRotation(vec: MC.Vector3): MC.Vector2 {
	return {y: Math.atan2(-vec.x, vec.z) * (180 / Math.PI), x: Math.atan2(vec.y, Math.sqrt(vec.x * vec.x + vec.z * vec.z)) * (180 / Math.PI)}
}

export function createRotationMatrixByRadian(pitch: number, yaw: number, roll: number): MC.Vector3[] {
	const cosYaw = Math.cos(pitch);
	const sinYaw = Math.sin(pitch);
	const cosPitch = Math.cos(yaw);
	const sinPitch = Math.sin(yaw);
	const cosRoll = Math.cos(roll);
	const sinRoll = Math.sin(roll);

	const rotationMatrix: MC.Vector3[] = [];

	rotationMatrix[0] = {
		x: cosYaw * cosPitch,
		y: cosYaw * sinPitch * sinRoll - sinYaw * cosRoll,
		z: cosYaw * sinPitch * cosRoll + sinYaw * sinRoll
	};

	rotationMatrix[1] = {
		x: sinYaw * cosPitch,
		y: sinYaw * sinPitch * sinRoll + cosYaw * cosRoll,
		z: sinYaw * sinPitch * cosRoll - cosYaw * sinRoll
	};

	rotationMatrix[2] = {
		x: -sinPitch,
		y: cosPitch * sinRoll,
		z: cosPitch * cosRoll
	};

	return rotationMatrix;
}

export function createRotationMatrixByDegrees(pitch: number, yaw: number, roll: number): MC.Vector3[] {
	return createRotationMatrixByRadian(pitch * (Math.PI / 180), yaw * (Math.PI / 180), roll * (Math.PI / 180));
}

export function rotateVector(vector: MC.Vector3, rotationMatrix: MC.Vector3[]): MC.Vector3 {
	if (rotationMatrix.length !== 3) throw new Error("Rotation must be an array of 3 elements");

	const x = vector.x * rotationMatrix[0].x + vector.y * rotationMatrix[0].y + vector.z * rotationMatrix[0].z;
	const y = vector.x * rotationMatrix[1].x + vector.y * rotationMatrix[1].y + vector.z * rotationMatrix[1].z;
	const z = vector.x * rotationMatrix[2].x + vector.y * rotationMatrix[2].y + vector.z * rotationMatrix[2].z;

	return { x, y, z };
}