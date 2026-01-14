import * as MC from '@minecraft/server';



function makeKey(playerId: string, key?: string) {
	if (key == null) return `PDP/${playerId}`;

	return `PDP/${playerId}/${key}`;
}

export function getDynamicPropertyByPlayerId(playerId: string, key: string) {
	return MC.world.getDynamicProperty(makeKey(playerId, key));
}

export function setDynamicPropertyByPlayerId(playerId: string, key: string, value: any) {
	return MC.world.setDynamicProperty(makeKey(playerId, key), value);
}

export function listDynamicPropertyByPlayerId(playerId: string) {
	return MC.world.getDynamicPropertyIds().filter(savedKey => savedKey.startsWith(makeKey(playerId))).map(savedKey => savedKey.substring(playerId.length + 1));
}

export function getDynamicPropertyByPlayer(player: MC.Player, key: string) {
	return getDynamicPropertyByPlayerId(player.id, key);
}

export function setDynamicPropertyByPlayer(player: MC.Player, key: string, value: any) {
	return setDynamicPropertyByPlayerId(player.id, key, value);
}

export function listDynamicPropertyByPlayer(player: MC.Player) {
	return listDynamicPropertyByPlayerId(player.id);
}