import { BinarySerializable, DataContainer, Hit } from "./interfaces";


export class FftData implements DataContainer, BinarySerializable {
    protected _fft: number[] = [];
    protected _timestamp: number = 0;

    /**
     * @param value Can be an array of 512 numbers or a buffer if serialized binary
     */
    public constructor(value: number[]|Buffer) {
        if(Buffer.isBuffer(value)) {
            this._fft = [];
            this._timestamp = 0;

            const arrayBuffer = value.buffer;
            const view = new DataView(arrayBuffer);

            this._timestamp = Number(view.getBigUint64(0));

            for(let i = 0; i < 512; i++) {
                this._fft.push(view.getFloat32((i*4)+8));
            }
        } else if(Array.isArray(value) && value.length == 512) {
            this._fft = value;
            this._timestamp = (new Date()).getTime();
        } else {
            throw new Error("Bad value given.");
        }
    }

    public get fft() : number[] {
        return this._fft;
    }

    public get timestamp(): number {
        return this._timestamp;
    }

    public set timestamp(timestamp: number) {
        this._timestamp = timestamp;
    }

    public get bytesize(): number {
        return 8 + 512*4;
    }

    public toString(): string {
        return `FftData(timestamp=${this.timestamp}, fft[${this.fft.length}]=${this.fft.join(",").substring(0, 50)}...)`;
    }

    public toBuffer(): Buffer {
        const bytes = 8 + 512*4;
        const buffer = new ArrayBuffer(bytes);
        const view = new DataView(buffer);

        view.setBigUint64(0, BigInt(this._timestamp));
        
        for(let i = 0; i < 512; i++) {
            view.setFloat32((i*4)+8, this.fft[i]);
        }

        return Buffer.from(buffer);
    }
}

export class PhaseData implements DataContainer {
    protected _i: number[] = [];
    protected _q: number[] = [];

    public constructor(i: number[], q: number[]) {
        this._i = i;
        this._q = q;
    }

    public get i() : number[] {
        return this._i;
    }

    public get q() : number[] {
        return this._q;
    }

    public toString(): string {
        return `PhaseData(i[${this.i.length}]=${this.i.join(",").substring(0, 12)}..., q[${this.q.length}]=${this.q.join(",").substring(0, 12)}...)`;
    }

    public toComplexArray(): number[] {
        const retArray:number[] = [];

        for(let i = 0; i < this.i.length; i++) {
            retArray.push(this.q[i]);
            retArray.push(this.i[i]);
        }

        return retArray;
    }
}

export class HitData implements DataContainer {
    protected _hits: Hit[] = [];

    public constructor(hits: Hit[]) {
        hits.sort(this.compare);
        this._hits = hits;
    }

    public get hits() : Hit[] {
        return this._hits;
    }

    public compare(a: Hit, b: Hit) {
        if (a.value < b.value) {
            return 1;
        }
        if (a.value > b.value) {
            return -1;
        }
        return 0;
    }

    public toString(): string {
        const summary: string[] = this._hits.slice(0, 5).map(hit => {
            return `${hit.value} at ${hit.index}`;
        });
        return `HitData(hits[${this._hits.length}]=${summary.join(", ")})`;
    }
}

export enum Unit {
    Meters = 1,
    Feet = 2
}
