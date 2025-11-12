import * as MC from '@minecraft/server';
import { CollisionVolume, collisionVolumeFromEntity } from '../colllision_box/collision_box';



export function getHitEntities(collision: CollisionVolume, entites: MC.Entity[] = MC.world.getDimension('overworld').getEntities({location: collision.getHeristicCenter(), maxDistance: collision.getHeristicRadius()})) {
	const hitEntities = [];

	for (const entity of entites) {
		if (collision.intersects(collisionVolumeFromEntity(entity))) {
			hitEntities.push(entity);
		}
	}

	return hitEntities;
}