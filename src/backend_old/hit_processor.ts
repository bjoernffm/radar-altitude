import { DataContainer, PhaseData, RadarInterface } from './radar';
import { FFT } from './fft';
import { TypedEmitter } from 'tiny-typed-emitter';
import { FftData } from './fft_transformer';
import { HitData, HitFinder } from './hit_finder';

export interface HitProcessorEvents
{
    'hitData': (hitData: HitData) => void;
}

export class HitProcessor extends TypedEmitter<HitProcessorEvents>
{
    private _hitFinder: HitFinder;

    constructor(hitFinder: HitFinder)
    {
        super();

        this._hitFinder = hitFinder;
        this._hitFinder.on('hitData', (hitData: HitData) => { this.processHits(hitData); });
    }

    private processHits(hitData: HitData) : void
    {
    }
}
