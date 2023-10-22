import * as fs from "fs";
import * as util from "util";
import { FftData } from "./containers";
import { TypedEmitter } from "tiny-typed-emitter";

interface RadarFileEvents {
    "loaded": () => void;
}

class RadarFile extends TypedEmitter<RadarFileEvents>
{
    static chunkByteSize = 8 + 512 * 4;
    private _filePath: string;

    constructor(filePath: string)
    {
        super();
        this._filePath = filePath;
    }

    public get filePath()
    {
        return this._filePath;
    }
}

export class RadarPlayerFile extends RadarFile
{
    private _fileHandle: number|null = null;
    private _currentIndex: number = 0;

    constructor(filePath: string)
    {
        super(filePath);

        fs.open(this.filePath, "r", (error, fileHandle) => {
            if (error) {
                throw error;
            }

            this._fileHandle = fileHandle;
            this.emit("loaded");
        });
    }

    public rewind()
    {
        this._currentIndex = 0;
    }

    public async getPreviousRecord()
    {
        this._currentIndex--;
        return await this.getRecord(this._currentIndex);
    }

    public async getNextRecord()
    {
        this._currentIndex++;
        return await this.getRecord(this._currentIndex);
    }

    public async getCurrentRecord()
    {
        return await this.getRecord(this._currentIndex);
    }

    private async getRecord(index: number)
    {
        if (this._fileHandle == null) {
            throw Error("No active file handle accessible");
        }

        const read = util.promisify(fs.read);
        const buffer = Buffer.alloc(RadarPlayerFile.chunkByteSize);
            
        const result = await read(this._fileHandle, buffer, 0, RadarPlayerFile.chunkByteSize, index * RadarPlayerFile.chunkByteSize);

        if (result.bytesRead != RadarPlayerFile.chunkByteSize) {
            console.warn("file end reached");
            throw Error("EOF reached");
        }

        return new FftData(buffer);
    }
}
