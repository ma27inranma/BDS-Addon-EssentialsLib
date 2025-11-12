import * as EssentialsLib from '../BP/scripts/dist/essentialslib.js';
import * as MC from '@minecraft/server';



MC.system.runInterval(() => {
	const player = MC.world.getDimension('overworld').getPlayers()[0];
	if (!player) return;

	const coneShape = EssentialsLib.CollisionVolumeCone.createConeWithDegrees(player.getPosition(), EssentialsLib.mul(player.getViewDirection(), 4), 35).visualize({green: 1, blue: 0, red: 0});
	// const aabbShape = new EssentialsLib.CollisionVolumeBox({x: 0, y: 0, z: 0}, {x: 1, y: 1, z: 1}).visualize({green: 1, blue: 0, red: 0});

	EssentialsLib.getHitEntities(coneShape).forEach(entity => {
	// EssentialsLib.getHitEntities(aabbShape).forEach(entity => {
		player.sendMessage('Target: ' + (entity.name ?? entity.nameTag ?? entity.typeId));
	});
});