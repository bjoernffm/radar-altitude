import { Readable, Stream } from "stream";
import { FftDataStream } from "./interfaces";
import { RadarPlayerFile } from "./RadarPlayerFile";
import { FftData } from "./containers";

export class RadarPlayer implements FftDataStream {
    private _fftDataStream: Readable;
    private _file: RadarPlayerFile;
    private _is_playing: boolean = false;
    private _currentRecord: FftData|null = null;
    private _nextRecord: FftData|null = null;
    private _startTime: number = 0;

    constructor(filePath: string, autoplay: boolean = false) {
        this._fftDataStream = new Stream.Readable({objectMode: true, read() {}});
        this._file = new RadarPlayerFile(filePath);

        this._file.addListener("loaded", async () => {
            if (autoplay == true) {
                this.play();
            }

            setInterval(async () => {
                if (this._is_playing == false || this._currentRecord == null || this._nextRecord == null) {
                    return;
                }

                const timeDelta = this._nextRecord.timestamp - this._currentRecord.timestamp;

                const currentTime = (new Date).getTime();
                const elapsedTime = currentTime-this._startTime;

                if (elapsedTime > timeDelta) {
                    //console.log(this._currentRecord.timestamp, timeDelta, elapsedTime);
                    this._currentRecord = this._nextRecord;
                    this._nextRecord = await this._file.getNextRecord();
                    this._startTime = (new Date).getTime();

                    this._fftDataStream.push(this._currentRecord);
                }
            }, 10);
        });
    }

    public getFftDataStream(): Readable {
        return this._fftDataStream;
    }

    public async play() {
        this._currentRecord = await this._file.getCurrentRecord();
        this._nextRecord = await this._file.getNextRecord();

        this._fftDataStream.push(this._currentRecord);

        this._startTime = (new Date).getTime();
        this._is_playing = true;
    }

    public pause() {
        this._is_playing = false;
    }

    public stop() {
        this._is_playing = false;
        this.rewind();
    }

    public rewind() {
        this._file.rewind();
    }
}