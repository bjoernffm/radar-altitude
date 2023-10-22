import { Transform } from "stream";
import { HitData } from "./containers";
import { Hit } from "./interfaces";

export class HitSelector extends Transform 
{
    constructor() 
    {
        super({objectMode: true});
    }

    _transform(chunk: HitData, encoding: string, callback: (arg0: null, arg1: Hit) => void) 
    {
        const hits = chunk.hits;
        const hit: Hit = hits.shift()!;
        
        callback(null, hit);
    }
}
