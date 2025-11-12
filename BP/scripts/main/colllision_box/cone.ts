import * as MC from '@minecraft/server';
import * as Debug from '@minecraft/debug-utilities';
import { CollisionVolume, intersects } from './collision_box';
import { CollisionVolumeBox } from './aabb';
import { add, sub, len, mul, dot, lenSq } from '../vec/vector3';
import { aabbCorners, closestParamsSegSeg, segmentIntersectsAABB, sphereIntersectsAABB } from './util';



export class CollisionVolumeCone implements CollisionVolume {
	public static createConeWithDegrees(base: MC.Vector3, direction: MC.Vector3, angleDegrees: number): CollisionVolumeCone {
		return new CollisionVolumeCone(base, direction, angleDegrees * Math.PI / 180);
	}

	public base: MC.Vector3;
	public direction: MC.Vector3;
	public angle: number;

	/**
	 * @warning angle is in radians
	 */
	constructor(base: MC.Vector3, direction: MC.Vector3, angle: number) {
		this.base = base;
		this.direction = direction;
		this.angle = angle;
	}

	public getHeristicCenter(): MC.Vector3 {
		const { axisUnit, height } = this.getAxis();
		return add(this.base, mul(axisUnit, height * 0.5));
	}

	public getHeristicRadius(): number {
		const { height } = this.getAxis();
		const t = Math.tan(this.angle);
		const rBase = height * t;
		return Math.sqrt((height * 0.5) * (height * 0.5) + rBase * rBase);
	}
	
	public containsPoint(point: MC.Vector3): boolean {
		const { axisUnit, height } = this.getAxis();
		const v = sub(point, this.base);
		const t = dot(v, axisUnit);
		if (t < 0 || t > height) return false;

		const distSqToAxis = lenSq(v) - t * t;
		const r = t * Math.tan(this.angle);
		return distSqToAxis <= r * r + 1e-7;
	}

	public intersects(_other: CollisionVolume): boolean {
		return intersects(this, _other);
	}

	public intersectsAABB(other: CollisionVolumeBox): boolean {
		const center = this.getHeristicCenter();
		const radius = this.getHeristicRadius();
		if (!sphereIntersectsAABB(center, radius, other)) return false;

		for (const p of aabbCorners(other)) {
			if (this.containsPoint(p)) return true;
		}

		const apex = this.base;
		const tip = add(this.base, this.direction);
		if (segmentIntersectsAABB(apex, tip, other)) return true;

		const aabbCenter = {
			x: (other.min.x + other.max.x) * 0.5,
			y: (other.min.y + other.max.y) * 0.5,
			z: (other.min.z + other.max.z) * 0.5,
		};
		if (this.containsPoint(aabbCenter)) return true;

		return false;
	}

	intersectsCone(other: CollisionVolumeCone): boolean {
		const c1 = this.getHeristicCenter();
		const r1 = this.getHeristicRadius();
		const c2 = other.getHeristicCenter();
		const r2 = other.getHeristicRadius();
		if (lenSq(sub(c1, c2)) > (r1 + r2) * (r1 + r2)) return false;

		if (other.containsPoint(this.base)) return true;
		if (this.containsPoint(other.base)) return true;

		const p1 = this.base;
		const q1 = add(this.base, this.direction);
		const p2 = other.base;
		const q2 = add(other.base, other.direction);
		const { s, t, distanceSq } = closestParamsSegSeg(p1, q1, p2, q2);
		const { height: h1 } = this.getAxis();
		const { height: h2 } = other.getAxis();
		const rAt1 = (s * h1) * Math.tan(this.angle);
		const rAt2 = (t * h2) * Math.tan(other.angle);
		if (distanceSq <= (rAt1 + rAt2) * (rAt1 + rAt2) + 1e-7) return true;

		return false;
	}

	public visualize(color: MC.RGB, dimension?: MC.Dimension, lifetime?: number): this {
		const removeAfter = lifetime ?? 10;

		const { axisUnit, height } = this.getAxis();
		if (height <= 1e-8) return this;

		const apex = this.base;
		const tip = add(this.base, this.direction);

		const axisArrow = new Debug.DebugArrow(apex, tip);
		axisArrow.color = color;
		Debug.debugDrawer.addShape(axisArrow);
		MC.system.runTimeout(() => axisArrow.remove(), removeAfter);

		let u = { x: -axisUnit.z, y: 0, z: axisUnit.x };
		const uLen = len(u);
		if (uLen <= 1e-8) {
			u = { x: 1, y: 0, z: 0 };
		} else {
			u = { x: u.x / uLen, y: u.y / uLen, z: u.z / uLen };
		}
		const v = {
			x: axisUnit.y * u.z - axisUnit.z * u.y,
			y: axisUnit.z * u.x - axisUnit.x * u.z,
			z: axisUnit.x * u.y - axisUnit.y * u.x,
		};

		const radius = height * Math.tan(this.angle);
		if (radius <= 1e-8) return this;

		const segments = 24;
		let prevPoint: MC.Vector3 | null = null;
		for (let i = 0; i <= segments; i++) {
			const t = (i / segments) * Math.PI * 2;
			const cosT = Math.cos(t);
			const sinT = Math.sin(t);
			const point: MC.Vector3 = {
				x: tip.x + radius * (u.x * cosT + v.x * sinT),
				y: tip.y + radius * (u.y * cosT + v.y * sinT),
				z: tip.z + radius * (u.z * cosT + v.z * sinT),
			};

			if (prevPoint) {
				const edge = new Debug.DebugLine(prevPoint, point);
				edge.color = color;
				Debug.debugDrawer.addShape(edge);
				MC.system.runTimeout(() => edge.remove(), removeAfter);
			}
			prevPoint = point;
		}

		const sideCount = 6;
		for (let i = 0; i < sideCount; i++) {
			const t = (i / sideCount) * Math.PI * 2;
			const cosT = Math.cos(t);
			const sinT = Math.sin(t);
			const rim: MC.Vector3 = {
				x: tip.x + radius * (u.x * cosT + v.x * sinT),
				y: tip.y + radius * (u.y * cosT + v.y * sinT),
				z: tip.z + radius * (u.z * cosT + v.z * sinT),
			};
			const side = new Debug.DebugLine(apex, rim);
			side.color = color;
			Debug.debugDrawer.addShape(side);
			MC.system.runTimeout(() => side.remove(), removeAfter);
		}

		return this;
	}

	private getAxis(): { axisUnit: MC.Vector3, height: number } {
		const h = len(this.direction);
		if (h < 1e-8) return { axisUnit: { x: 0, y: 0, z: 0 }, height: 0 };
		return { axisUnit: { x: this.direction.x / h, y: this.direction.y / h, z: this.direction.z / h }, height: h };
	}
}