import * as MC from '@minecraft/server';
import { AbstractStorageProvider } from './storage_provider';



export class CachedStorage {
	public provider: AbstractStorageProvider<any>;

	public table: Record<string, any> = {};

	public constructor(provider: AbstractStorageProvider<any>) {
		this.provider = provider;

		this.loadAndOverride();
	}

	public save() {
		Object.entries(this.table).forEach(entry => {
			this.provider.setObject(entry[0], entry[1]);
		});
	}

	public loadAndOverride() {
		this.provider.keys().forEach(key => {
			this.table[key] = this.provider.getObject(key, true);
		});
	}
}