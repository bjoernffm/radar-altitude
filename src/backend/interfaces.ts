import { Readable } from "stream";

export interface FftDataStream
{
    getFftDataStream(): Readable
}

export interface Hit {
    index: number;
    value: number
}

export interface DataContainer
{
    toString() : string
}

export interface BinarySerializable
{
    toBuffer(): Buffer
}