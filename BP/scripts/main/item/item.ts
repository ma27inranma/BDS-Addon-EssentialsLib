import * as MC from '@minecraft/server';



export function shrink(item: MC.ItemStack, amount: number = 1): boolean {
	if (item.amount - amount <= 0) return false;

	item.amount -= amount;
	return true;
}

export function shrinkGet(item: MC.ItemStack, amount: number = 1): MC.ItemStack | undefined {
	if (item.amount - amount <= 0) return;

	const newItem = item.clone();
	newItem.amount -= amount;

	return newItem;
}