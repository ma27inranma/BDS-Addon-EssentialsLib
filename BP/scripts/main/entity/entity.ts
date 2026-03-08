import * as MC from '@minecraft/server';
import * as Item from '../item/item';
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

export function tryShrinkHeldItem(entity: MC.Entity, amount: number = 1) {
	const equippable = entity.getComponent('equippable');
	const heldItem = equippable?.getEquipment(MC.EquipmentSlot.Mainhand);
	if (!heldItem) return;

	equippable?.setEquipment(MC.EquipmentSlot.Mainhand, Item.shrinkGet(heldItem, amount));
}