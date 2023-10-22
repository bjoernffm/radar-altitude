import { SerialPort, ReadlineParser } from "serialport";
import { Readable, Stream } from "stream";
import { FftData, PhaseData } from "./containers";
import { FftDataStream } from "./interfaces";

export class Radar implements FftDataStream
{
    private _device: SerialPort;
    private _currentIValues: number[] = [];
    private _currentQValues: number[] = [];

    private _fftDataStream: Readable;

    public getFftDataStream(): Readable
    {
        return this._fftDataStream;
    }

    constructor(devicePath: string)
    {
        this._device = new SerialPort({
            path: devicePath,
            baudRate: 19200,
        }, function (err) {
            if (err) {
                return console.log("Error: ", err.message);
            }
        });
        
        this.setupDevice();

        //this._phaseDataStream = new Stream.Readable({objectMode: true, read() {}});
        //this._fftDataStream = new Stream.Readable({read() {}});
        this._fftDataStream = new Stream.Readable({objectMode: true, read() {}});
    }

    private setupDevice()
    {
        this._device.write("uC"); // centimeter as unit
        this._device.write("Od"); // distance data
        this._device.write("P0"); // Max Power
        this._device.write("W0"); // Max Power
        this._device.write("OF"); // fft data
        //this._device.write('OR'); // phase data

        const parser = this._device.pipe(new ReadlineParser({ delimiter: "\r\n" }));

        parser.on("data", (data: string) => this.processData(data));
    }

    private processData(data: string) : void
    {
        if (data.startsWith("{\"FFT\":")) {
            const json = JSON.parse(data) as {"FFT": number[]};

            this._fftDataStream.push(new FftData(json.FFT));


            /*const currentDate = new Date();
            const timestamp = currentDate.getTime();

            json.FFT.unshift(timestamp);
            //console.log(json.FFT.length, json.FFT);

            const arra = new Uint16Array(json.FFT);
            const buffe = Buffer.from(arra.buffer);*/
            

            //console.log(buffe);
            //this._fftDataStream.push(buffe);
        } else if (data.startsWith("{\"I\":")) {
            const json = JSON.parse(data) as {"I": number[]};
            this._currentIValues = json.I;
        } else if (data.startsWith("{\"Q\":")) {
            const json = JSON.parse(data) as {"Q": number[]};
            this._currentQValues = json.Q;
            
            //this._phaseDataStream.push(new PhaseData(this._currentIValues, this._currentQValues))
        }
    }
}
