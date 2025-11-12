import * as MC from '@minecraft/server';
import { CollisionVolume } from './collision_box';
import { CollisionVolumeBox } from './aabb';

// TODO


/*
export class CollisionVolumeUnion implements CollisionVolume {
	constructor(private a: CollisionVolume, private b: CollisionVolume) {}

	intersects(other: CollisionVolume): boolean {
		return this.a.intersects(other) || this.b.intersects(other);
	}

	intersectsAABB(other: CollisionVolumeBox): boolean {
		return this.a.intersectsAABB(other) || this.b.intersectsAABB(other);
	}

	containsPoint(point: MC.Vector3): boolean {
		return this.a.containsPoint(point) || this.b.containsPoint(point);
	}

	union(other: CollisionVolume): CollisionVolume {
		return new CollisionVolumeUnion(this, other);
	}
}*/

