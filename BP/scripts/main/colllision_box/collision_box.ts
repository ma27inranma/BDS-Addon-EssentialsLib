import * as MC from '@minecraft/server';
import { CollisionVolumeBox } from './aabb';
import { add, sub } from '../vec/vector3';

export interface CollisionVolume {
	getHeristicRadius(): number,
	getHeristicCenter(): MC.Vector3,

	intersects(other: CollisionVolume): boolean,
	intersectsAABB(other: CollisionVolumeBox): boolean,

	containsPoint(point: MC.Vector3): boolean,
	// union(other: CollisionVolume): CollisionVolume
}


export function intersects(a: CollisionVolume, b: CollisionVolume): boolean {
	if (b instanceof CollisionVolumeBox) return a.intersectsAABB(b);
	if (a instanceof CollisionVolumeBox) return b.intersectsAABB(a);
	// if (a instanceof CollisionVolumeUnion) return a.intersects(b);
	// if (b instanceof CollisionVolumeUnion) return b.intersects(a);

	throw new Error('Unreachable');
}

export function collisionVolumeFromEntity(entity: MC.Entity): CollisionVolume {
	return new CollisionVolumeBox(sub(entity.getAABB().center, entity.getAABB().extent), add(entity.getAABB().center, entity.getAABB().extent));
}