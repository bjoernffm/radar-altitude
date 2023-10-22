import { SerialPort, ReadlineParser } from 'serialport'
import { TypedEmitter } from 'tiny-typed-emitter';
import { FftData } from './fft_transformer';

export interface DataContainer
{
    toString() : string
}

export class PhaseData implements DataContainer
{
    protected _i: number[] = [];
    protected _q: number[] = [];

    public constructor(i: number[], q: number[])
    {
        this._i = i;
        this._q = q;
    }

    public get i() : number[]
    {
        return this._i;
    }

    public get q() : number[]
    {
        return this._q;
    }

    public toString(): string
    {
        return `PhaseData(i[${this.i.length}]=${this.i.join(",").substring(0, 12)}..., q[${this.q.length}]=${this.q.join(",").substring(0, 12)}...)`
    }

    public toComplexArray(): number[]
    {
        let retArray:number[] = [];

        for(let i = 0; i < this.i.length; i++) {
            retArray.push(this.q[i]);
            retArray.push(this.i[i]);
        }

        return retArray;
    }
}

export interface RadarEvents
{
    'phaseData': (phaseData: PhaseData) => void;
    'fftData': (fftData: FftData) => void;
}

export interface RadarInterface extends TypedEmitter<RadarEvents>
{}

export class Radar extends TypedEmitter<RadarEvents>
{
    private _device: SerialPort;
    private _currentIValues: number[] = [];
    private _currentQValues: number[] = [];

    constructor(devicePath: string)
    {
        super();

        this._device = new SerialPort({
            path: devicePath,
            baudRate: 19200,
        }, function (err) {
            if (err) {
              return console.log('Error: ', err.message)
            }
        });
        
        this.setupDevice();
    }

    private setupDevice()
    {
        this._device.write('uC'); // centimeter as unit
        this._device.write('Od'); // distance data
        this._device.write('P0'); // Max Power
        this._device.write('W0'); // Max Power
        this._device.write('OF'); // fft data
        //this._device.write('OR'); // phase data

        const parser = this._device.pipe(new ReadlineParser({ delimiter: '\r\n' }))

        parser.on('data', (data: string) => this.processData(data));
    }

    private processData(data: string) : void
    {
        if (data.startsWith('{"FFT":')) {
            //console.timeEnd("fft");
            //console.time("fft");
            let json = JSON.parse(data) as {"FFT": number[]};
            this.emit('fftData', new FftData(json.FFT));
        } else if (data.startsWith('{"I":')) {
            let json = JSON.parse(data) as {"I": number[]};
            this._currentIValues = json.I;
        } else if (data.startsWith('{"Q":')) {
            let json = JSON.parse(data) as {"Q": number[]};
            this._currentQValues = json.Q;
            
            this.emit('phaseData', new PhaseData(this._currentIValues, this._currentQValues));
        }
    }
}
