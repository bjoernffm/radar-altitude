import { Readable, Stream } from "stream";
import { FftDataStream } from "./interfaces";
import { RadarPlayerFile } from "./RadarPlayerFile";

export class RadarPlayer implements FftDataStream
{
    private _fftDataStream: Readable;
    private _file: RadarPlayerFile;
    private _is_playing: boolean = false;

    constructor(filePath: string)
    {
        this._fftDataStream = new Stream.Readable({objectMode: true, read() {}});
        this._file = new RadarPlayerFile(filePath);

        this._file.addListener('loaded', async () => {
            let currentRecord = await this._file.getCurrentRecord();
            let nextRecord = await this._file.getNextRecord();
            let timeDelta = nextRecord.timestamp - currentRecord.timestamp;

            let startTime = (new Date).getTime();
            setInterval(async () => {
                let currentTime = (new Date).getTime();
                let elapsedTime = currentTime-startTime;

                if (elapsedTime > timeDelta) {
                    currentRecord = nextRecord;
                    nextRecord = await this._file.getNextRecord();
                    timeDelta = nextRecord.timestamp - currentRecord.timestamp;
                    startTime = (new Date).getTime();
                }

                console.log(currentRecord.timestamp, timeDelta, elapsedTime);
            }, 100);
        });
    }

    public getFftDataStream(): Readable
    {
        return this._fftDataStream;
    }

    public play()
    {
        this._is_playing = true;
    }

    public stop()
    {
        this._is_playing = false;
    }
}