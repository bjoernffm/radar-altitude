import { DataContainer, PhaseData, RadarInterface } from './radar';
import { FFT } from './fft';
import { TypedEmitter } from 'tiny-typed-emitter';
import { FftData } from './fft_transformer';

export interface Hit {
    index: number;
    value: number
}

export class HitData implements DataContainer
{
    protected _hits: Hit[] = [];

    public constructor(hits: Hit[])
    {
        hits.sort(this.compare);
        this._hits = hits;
    }

    public get hits() : Hit[]
    {
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

    public toString(): string
    {
        const summary: string[] = this._hits.slice(0, 5).map(hit => {
            return `${hit.value} at ${hit.index}`;
        });
        return `HitData(hits[${this._hits.length}]=${summary.join(", ")})`
    }
}

export interface HitFinderEvents
{
    'hitData': (hitData: HitData) => void;
}

export class HitFinder extends TypedEmitter<HitFinderEvents>
{
    private _radar: RadarInterface;

    constructor(radar: RadarInterface)
    {
        super();

        this._radar = radar;
        this._radar.on('fftData', (fftData: FftData) => { this.findHits(fftData); });
    }

    private findHits(fftData: FftData) : void
    {
        const fft = fftData.fft;

        let hits: Hit[] = [];
        let peakIndexes: number[] = [];

        if(fft[0] > fft[1]) {
            hits.push({index: 0, value: fft[0]});
        }

        for(let i = 1; i < fft.length; i++) {
            let previous = fft[i - 1];
            let current = fft[i];

            if (current > previous) { // start peak
                peakIndexes = [i]
            } else if (current == previous) { // existing peak (plateau)
                peakIndexes.push(i)
            } else if (current < previous && peakIndexes.length > 0) { // end peak
                if (peakIndexes.length > 1) {
                    peakIndexes = [peakIndexes[Math.floor(peakIndexes.length/2)]];
                }
                
                hits.push({index: peakIndexes[0], value: fft[peakIndexes[0]]});
                peakIndexes = [];
            }
        }

        if (peakIndexes.length > 0) { // ended on a plateau
            if (peakIndexes.length > 1) {
                peakIndexes = [peakIndexes[Math.floor(peakIndexes.length/2)]];
            }
            
            hits.push({index: peakIndexes[0], value: fft[peakIndexes[0]]});
        }

        this.emit("hitData", new HitData(hits));
    }
}
