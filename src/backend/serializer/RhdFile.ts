import * as fs from "fs";
import * as util from "util";
import { FftData } from "../containers";

interface RhdFileHeader {
    signature: string
    version: number
    start: number
}

interface RhdFileConstructorOptions {
    path: string
    handle: number
    header: RhdFileHeader
}

export class RhdFile {
    static chunkByteSize = 8 + 512 * 4;
    private _path: string;
    private _handle: number;
    private _currentIndex: number = 0;
    private _header: RhdFileHeader;

    constructor(options: RhdFileConstructorOptions) {
        this._handle = options.handle;
        this._path = options.path;
        this._header = options.header;
    }

    public get path(): string {
        return this._path;
    }

    public get header(): RhdFileHeader {
        return this._header;
    }

    public rewind() {
        this._currentIndex = 0;
    }

    public async getPreviousRecord(): Promise<FftData> {
        this._currentIndex--;
        return await this.getRecord(this._currentIndex);
    }

    public async getNextRecord(): Promise<FftData> {
        this._currentIndex++;
        return await this.getRecord(this._currentIndex);
    }

    public async getCurrentRecord(): Promise<FftData> {
        return await this.getRecord(this._currentIndex);
    }

    private async getRecord(index: number): Promise<FftData> {
        if (this._handle == null) {
            throw Error("No active file handle accessible");
        }

        const read = util.promisify(fs.read);
        const buffer = Buffer.alloc(RhdFile.chunkByteSize);
            
        const result = await read(this._handle, buffer, 0, RhdFile.chunkByteSize, index * RhdFile.chunkByteSize);

        if (result.bytesRead != RhdFile.chunkByteSize) {
            throw Error("EOF reached");
        }

        const arrayBuffer = buffer.buffer;
        const view = new DataView(arrayBuffer);

        const timestamp = Number(view.getBigUint64(0));

        const fft = [];
        for(let i = 0; i < 512; i++) {
            fft.push(view.getFloat32((i*4)+8));
        }

        return new FftData(fft, timestamp);
    }
}
