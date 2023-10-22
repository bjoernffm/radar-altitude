import { Transform } from "stream";
import { Unit } from "./containers";
import { Hit } from "./interfaces";

export class HitToDistance extends Transform {

    static range_constant = 20; // max. range in meters (might be finetuned later)
    private unit: Unit;

    constructor(unit: Unit = Unit.Meters) {
        super({objectMode: true});

        this.unit = unit;
    }

    _transform(chunk: Hit, encoding: string, callback: (arg0: null, arg1: number) => void) {
        const percentage = chunk.index / 512; // there is only a range of 512
        let distance = percentage * HitToDistance.range_constant;

        if(this.unit == Unit.Feet) {
            distance *= 3.28084;
        }
        
        callback(null, distance);
    }
}
