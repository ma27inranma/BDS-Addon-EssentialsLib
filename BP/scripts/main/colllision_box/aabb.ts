import * as MC from '@minecraft/server';
import { CollisionVolume, intersects } from './collision_box';
import { add, div, len, sub } from '../vec/vector3';



export class CollisionVolumeBox implements CollisionVolume {
	public min: MC.Vector3;
	public max: MC.Vector3;

	constructor(min: MC.Vector3, max: MC.Vector3) {
		const minX = Math.min(min.x, max.x);
		const minY = Math.min(min.y, max.y);
		const minZ = Math.min(min.z, max.z);
		const maxX = Math.max(min.x, max.x);
		const maxY = Math.max(min.y, max.y);
		const maxZ = Math.max(min.z, max.z);

		this.min = {x: minX, y: minY, z: minZ};
		this.max = {x: maxX, y: maxY, z: maxZ};
	}

	getHeristicRadius(): number {
		return len(sub(this.max, this.min)) / 2;
	}

	getHeristicCenter(): MC.Vector3 {
		return add(this.min, div(sub(this.max, this.min), 2));
	}

	intersects(_other: CollisionVolume): boolean {
		return intersects(this, _other);
	}

	intersectsAABB(other: CollisionVolumeBox): boolean {
		return !(this.max.x < other.min.x || this.min.x > other.max.x || this.max.y < other.min.y || this.min.y > other.max.y || this.max.z < other.min.z || this.min.z > other.max.z);
	}

	containsPoint(point: MC.Vector3): boolean {
		return point.x >= this.min.x && point.x <= this.max.x && point.y >= this.min.y && point.y <= this.max.y && point.z >= this.min.z && point.z <= this.max.z;
	}

	// union(other: CollisionVolume): CollisionVolume {
	// 	return new CollisionVolumeUnion(this, other);
	// }
}