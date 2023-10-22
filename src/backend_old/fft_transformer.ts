import { DataContainer, PhaseData, RadarInterface } from './radar';
import { FFT } from './fft';
import { TypedEmitter } from 'tiny-typed-emitter';

export class FftData implements DataContainer
{
    protected _fft: number[] = [];

    public constructor(fft: number[])
    {
        this._fft = fft;
    }

    public get fft() : number[]
    {
        return this._fft;
    }

    public toString(): string
    {
        return `FftData(fft[${this.fft.length}]=${this.fft.join(",").substring(0, 12)}...)`
    }
}

function hann(index: number, arrayLength: number)
{
    return 0.5*(1 - Math.cos(6.283185307179586*index/(arrayLength-1)))
}

export interface FftTransformerEvents
{
    'fftData': (fftData: FftData) => void;
}

export class FftTransformer extends TypedEmitter<FftTransformerEvents>
{
    private _radar: RadarInterface;
    private _hannValues: number[] = [];

    constructor(radar: RadarInterface)
    {
        super();

        for(let i = 0; i < 512; i++) {
            this._hannValues[i] = hann(i, 512)
        }

        this._radar = radar;
        this._radar.on('phaseData', (phaseData: PhaseData) => { this.processData(phaseData); });
    }

    private processData(phaseData: PhaseData) : void
    {
        const meanI = phaseData.i.reduce((a, b) => a + b, 0) / phaseData.i.length;
        const meanQ = phaseData.q.reduce((a, b) => a + b, 0) / phaseData.q.length;
        
        let i = phaseData.i.map(element => {
            return element - meanI;
        }).map((element, index) => {
            return this._hannValues[index] * element;
        });

        let q = phaseData.q.map(element => {
            return element - meanQ;
        }).map((element, index) => {
            return this._hannValues[index] * element;
        });
        
        const fft = new FFT(512);
        const output = fft.createComplexArray();
        fft.transform(output, (new PhaseData(i, q)).toComplexArray());

        this.emit('fftData', new FftData(output));
    }
}
