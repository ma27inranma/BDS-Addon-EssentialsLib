


export abstract class Noise3d {
	/**
	 * 0 to 1 (exclusive)
	 */
	public randomGen: () => number;

	public constructor(randomGenerator: () => number) {
		this.randomGen = randomGenerator;
	}

	public abstract noise3d(x: number, y: number, z: number): number;
}

export class SimplexNoise3d extends Noise3d {
	private perm: Uint8Array;

	constructor(randomGenerator: () => number = Math.random) {
		super(randomGenerator);

		const p = new Uint8Array(256);
		for (let i = 0; i < 256; i++) {
			p[i] = i;
		}

		for (let i = 255; i > 0; i--) {
			const j = Math.floor(this.randomGen() * (i + 1));
			const temp = p[i];
			p[i] = p[j];
			p[j] = temp;
		}

		this.perm = new Uint8Array(512);
		for (let i = 0; i < 512; i++) {
			this.perm[i] = p[i & 255];
		}
	}

	public noise3d(x: number, y: number, z: number): number {
		let n0, n1, n2, n3;

		const F3 = 1.0 / 3.0;
		const s = (x + y + z) * F3;
		const i = Math.floor(x + s);
		const j = Math.floor(y + s);
		const k = Math.floor(z + s);

		const G3 = 1.0 / 6.0;
		const t = (i + j + k) * G3;
		const X0 = i - t;
		const Y0 = j - t;
		const Z0 = k - t;
		const x0 = x - X0;
		const y0 = y - Y0;
		const z0 = z - Z0;

		let i1, j1, k1;
		let i2, j2, k2;

		if (x0 >= y0) {
			if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
			else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
			else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
		} else {
			if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
			else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
			else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
		}

		const x1 = x0 - i1 + G3;
		const y1 = y0 - j1 + G3;
		const z1 = z0 - k1 + G3;
		const x2 = x0 - i2 + 2.0 * G3;
		const y2 = y0 - j2 + 2.0 * G3;
		const z2 = z0 - k2 + 2.0 * G3;
		const x3 = x0 - 1.0 + 3.0 * G3;
		const y3 = y0 - 1.0 + 3.0 * G3;
		const z3 = z0 - 1.0 + 3.0 * G3;

		const ii = i & 255;
		const jj = j & 255;
		const kk = k & 255;
		const perm = this.perm;

		const gi0 = perm[ii + perm[jj + perm[kk]]];
		const gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]];
		const gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]];
		const gi3 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]];

		let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
		if (t0 < 0) n0 = 0.0;
		else {
			t0 *= t0;
			n0 = t0 * t0 * this.grad(gi0, x0, y0, z0);
		}

		let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
		if (t1 < 0) n1 = 0.0;
		else {
			t1 *= t1;
			n1 = t1 * t1 * this.grad(gi1, x1, y1, z1);
		}

		let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
		if (t2 < 0) n2 = 0.0;
		else {
			t2 *= t2;
			n2 = t2 * t2 * this.grad(gi2, x2, y2, z2);
		}

		let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
		if (t3 < 0) n3 = 0.0;
		else {
			t3 *= t3;
			n3 = t3 * t3 * this.grad(gi3, x3, y3, z3);
		}

		return 32.0 * (n0 + n1 + n2 + n3);
	}

	private grad(hash: number, x: number, y: number, z: number): number {
		const h = hash & 15;
		const u = h < 8 ? x : y;
		const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
		return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
	}
}