

export interface RandomPickerItem<T> {
	weight: number;
	item: T;
}

export interface IRandomPicker<T> {
	pick(): RandomPickerItem<T>[];
}

function isRandomPicker(value: unknown): value is IRandomPicker<unknown> {
	return typeof value === "object" && value !== null && typeof (value as IRandomPicker<unknown>).pick === "function";
}

export class RandomPicker<T> implements IRandomPicker<T> {
	private readonly items: RandomPickerItem<T>[] = [];

	public addItem(item: T, weight: number): this {
		this.items.push({ item, weight });
		return this;
	}

	public copyFrom(other: RandomPicker<T>): this {
		this.items.push(...other.items);
		return this;
	}

	private pickIndex(): number {
		const totalWeight = this.items.reduce((sum, e) => sum + e.weight, 0);
		const rand = Math.random() * totalWeight;

		let sum = 0;
		for (let i = 0; i < this.items.length; i++) {
			sum += this.items[i].weight;
			if (rand < sum) return i;
		}

		return -1;
	}

	pick(): RandomPickerItem<T>[] {
		const index = this.pickIndex();
		return index >= 0 ? [this.items[index]] : [];
	}
}


export class RandomPickerLoop<T> implements IRandomPicker<T> {
	private readonly items: RandomPickerItem<T>[] = [];
	loopCount: number;

	constructor(loopCount: number) {
		this.loopCount = loopCount;
	}

	public addItem(item: T, weight: number): this {
		this.items.push({ item, weight });
		return this;
	}

	public copyFrom(other: RandomPickerLoop<T>): this {
		this.items.push(...other.items);
		return this;
	}

	private pickIndices(): number[] {
		const totalWeight = this.items.reduce((sum, e) => sum + e.weight, 0);
		const indices: number[] = [];

		for (let i = 0; i < this.loopCount; i++) {
			const rand = Math.random() * totalWeight;

			let cur = 0;
			for (let j = 0; j < this.items.length; j++) {
				cur += this.items[j].weight;

				if (rand < cur) {
					indices.push(j);
					break;
				}
			}
		}

		return indices;
	}

	public pick(): RandomPickerItem<T>[] {
		return this.pickIndices().map((i) => this.items[i]);
	}
}


export class RandomPickerEach<T> implements IRandomPicker<T> {
	private readonly items: RandomPickerItem<T>[] = [];

	/**
	 * @param weight 0 to 1
	 */
	public addItem(item: T, weight: number): this {
		this.items.push({ item, weight });
		return this;
	}

	public copyFrom(other: RandomPickerEach<T>): this {
		this.items.push(...other.items);
		return this;
	}

	public pick(): RandomPickerItem<T>[] {
		return this.items.filter((e) => e.weight > Math.random());
	}
}


export function evaluateRandomPicker<T>(picker: IRandomPicker<unknown>): RandomPickerItem<T>[] {
	const result: RandomPickerItem<T>[] = [];
	for (const entry of picker.pick()) {
		if (isRandomPicker(entry.item)) {
			result.push(...evaluateRandomPicker<T>(entry.item));
		} else {
			result.push(entry as RandomPickerItem<T>);
		}
	}

	return result;
}