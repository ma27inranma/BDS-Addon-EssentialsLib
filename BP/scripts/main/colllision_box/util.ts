import * as MC from '@minecraft/server';
import { CollisionVolumeBox } from './aabb';
import { add, sub, mul, dot, lenSq } from '../vec/vector3';



export function sphereIntersectsAABB(center: MC.Vector3, radius: number, box: CollisionVolumeBox): boolean {
	const cx = clamp(center.x, box.min.x, box.max.x);
	const cy = clamp(center.y, box.min.y, box.max.y);
	const cz = clamp(center.z, box.min.z, box.max.z);
	const dx = center.x - cx;
	const dy = center.y - cy;
	const dz = center.z - cz;
	return (dx * dx + dy * dy + dz * dz) <= radius * radius + 1e-7;
}

export function aabbCorners(box: CollisionVolumeBox): MC.Vector3[] {
	const { min, max } = box;
	return [
		{ x: min.x, y: min.y, z: min.z },
		{ x: min.x, y: min.y, z: max.z },
		{ x: min.x, y: max.y, z: min.z },
		{ x: min.x, y: max.y, z: max.z },
		{ x: max.x, y: min.y, z: min.z },
		{ x: max.x, y: min.y, z: max.z },
		{ x: max.x, y: max.y, z: min.z },
		{ x: max.x, y: max.y, z: max.z },
	];
}

export function segmentIntersectsAABB(a: MC.Vector3, b: MC.Vector3, box: CollisionVolumeBox): boolean {
	let tmin = 0;
	let tmax = 1;
	const d = sub(b, a);
	const axes: Array<['x' | 'y' | 'z', number, number]> = [
		['x', box.min.x, box.max.x],
		['y', box.min.y, box.max.y],
		['z', box.min.z, box.max.z],
	];
	for (const [axis, minV, maxV] of axes) {
		const o = a[axis];
		const v = d[axis];
		if (Math.abs(v) < 1e-8) {
			if (o < minV || o > maxV) return false;
		} else {
			const inv = 1 / v;
			let t1 = (minV - o) * inv;
			let t2 = (maxV - o) * inv;
			if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; }
			tmin = Math.max(tmin, t1);
			tmax = Math.min(tmax, t2);
			if (tmin > tmax) return false;
		}
	}
	return true;
}

export function closestParamsSegSeg(p1: MC.Vector3, q1: MC.Vector3, p2: MC.Vector3, q2: MC.Vector3): { s: number, t: number, distanceSq: number } {
	const d1 = sub(q1, p1);
	const d2 = sub(q2, p2);
	const r = sub(p1, p2);
	const a = dot(d1, d1);
	const e = dot(d2, d2);
	const f = dot(d2, r);

	let s: number, t: number;

	if (a <= 1e-12 && e <= 1e-12) {
		s = 0; t = 0;
		return { s, t, distanceSq: lenSq(sub(p1, p2)) };
	}

	if (a <= 1e-12) {
		s = 0;
		t = clamp(f / e, 0, 1);
	} else {
		const c = dot(d1, r);
		if (e <= 1e-12) {
			t = 0;
			s = clamp(-c / a, 0, 1);
		} else {
			const b = dot(d1, d2);
			const denom = a * e - b * b;
			if (denom !== 0) {
				s = clamp((b * f - c * e) / denom, 0, 1);
			} else {
				s = 0;
			}
			const tNom = b * s + f;
			if (tNom < 0) {
				t = 0;
				s = clamp(-c / a, 0, 1);
			} else if (tNom > e) {
				t = 1;
				s = clamp((b - c) / a, 0, 1);
			} else {
				t = tNom / e;
			}
		}
	}

	const cp1 = add(p1, mul(d1, s));
	const cp2 = add(p2, mul(d2, t));
	return { s, t, distanceSq: lenSq(sub(cp1, cp2)) };
}

export function clamp(x: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, x));
}

