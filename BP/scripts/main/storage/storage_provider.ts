import * as MC from '@minecraft/server';

export interface DynamicPropertyProvider {
	getDynamicProperty(key: string): any;
	setDynamicProperty(key: string, value: any): void;
	getDynamicPropertyIds(): string[];

	getDynamicPropertyIdsRaw?(): string[];
	prefix?: string;
}

export interface StorageSerializer<StorageRepresentation> {
	serialize: (raw: any) => StorageRepresentation;
	deserialize: (value: StorageRepresentation) => any;
}

export const JsonParser = {
	serialize: JSON.stringify,
	deserialize: JSON.parse
}


export abstract class AbstractStorageProvider<StorageRepresentation> {
	public abstract getRaw(key: string): StorageRepresentation | undefined;
	/**
	 * @param returnUndefined Suppress error and return undefined instead?
	 */
	public abstract getObject(key: string, returnUndefined?: boolean): any | undefined;
	public abstract setRaw(key: string, value: StorageRepresentation | undefined): boolean;
	public abstract setObject(key: string, value: any | undefined): void;
	public abstract keysInternal(): string[];
	public abstract keys(): string[];
}

export class DynamicPropertyStorageProvider extends AbstractStorageProvider<string> {
	private dynamicPropertyProvider: DynamicPropertyProvider;

	private objectParser: StorageSerializer<string> = JsonParser;

	/**
	 * @deprecated Use createDynamicPropertyProviderStorageProvider
	 */
	public constructor(dynamicPropertyProvider: DynamicPropertyProvider) {
		super();
		this.dynamicPropertyProvider = dynamicPropertyProvider;
	}

	public setObjectParser(newParser: StorageSerializer<any>) {
		this.objectParser = newParser;
	}

	public getRaw(key: string) {
		return this.dynamicPropertyProvider.getDynamicProperty(key);
	}

	public getObject(key: string, returnUndefined: boolean = false) {
		const raw = this.getRaw(key);
		if (raw === undefined) return;

		try {
			return this.objectParser.deserialize(raw);
		} catch(e) {
			if (returnUndefined) return undefined;

			throw e;
		}
	}

	public setRaw(key: string, value: string | undefined): boolean {
		this.dynamicPropertyProvider.setDynamicProperty(key, value);
		return true;
	}

	public setObject(key: string, value: any | undefined) {
		this.setRaw(key, this.objectParser.serialize(value));
	}

	public keys(): string[] {
		return this.keysInternal();
	}

	public keysInternal(): string[] {
		return this.dynamicPropertyProvider.getDynamicPropertyIds();
	}
}


/**
 * for internal use
 */
export function createWrappedDynamicPropertyProvider(original: DynamicPropertyProvider, path: string): DynamicPropertyProvider {
	return {
		getDynamicProperty: (key) => original.getDynamicProperty(`ELib/${path}/${key}`),
		setDynamicProperty: (key, value) => original.setDynamicProperty(`ELib/${path}/${key}`, value),
		getDynamicPropertyIds: () => original.getDynamicPropertyIds().filter(key => key.startsWith(`ELib/${path}/`)).map(key => key.substring(`ELib/${path}/`.length)),
		getDynamicPropertyIdsRaw: () => original.getDynamicPropertyIds().filter(key => key.startsWith(`ELib/${path}/`)),
		prefix: `ELib/${path}/`
	};
}

/**
 * @param provider World or Entity or ItemStack
 * @param path key to the storage space
 */
export function createDynamicPropertyProviderStorageProvider(provider: DynamicPropertyProvider, path: string): DynamicPropertyStorageProvider {
	return new DynamicPropertyStorageProvider(createWrappedDynamicPropertyProvider(provider, path));
}