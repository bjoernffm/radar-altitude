import { Transform } from "stream";
import { FftData, HitData } from "./containers";
import { Hit } from "./interfaces";

export class HitFinder extends Transform {
    constructor() {
        super({objectMode: true});
    }

    _transform(chunk: FftData, encoding: string, callback: (arg0: null, arg1: HitData) => void) {
        const fft = chunk.fft;

        const hits: Hit[] = [];
        let peakIndexes: number[] = [];

        if(fft[0] > fft[1]) {
            hits.push({index: 0, value: fft[0]});
        }

        for(let i = 1; i < fft.length; i++) {
            const previous = fft[i - 1];
            const current = fft[i];

            if (current > previous) { // start peak
                peakIndexes = [i];
            } else if (current == previous) { // existing peak (plateau)
                peakIndexes.push(i);
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
        
        callback(null, new HitData(hits));
    }
}
