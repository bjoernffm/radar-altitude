//import { Radar } from "./Radar";
import { RadarPlayer } from "./RadarPlayer";
//import { RadarRecorder } from "./RadarRecorder";
import { HitData } from "./containers";
import { HitFinder } from "./hit_finder";
import { HitSelector } from "./hit_selector";
import { HitToDistance } from "./hit_to_distance";

//const radar = new Radar("COM3");
const radar = new RadarPlayer("sample.dat", {autoplay: true});

const stream = radar.getFftDataStream();

stream.on("data", (data) => {
    console.log(data.toString());
});

stream
    .pipe(new HitFinder())
    .pipe(new HitSelector())
    .pipe(new HitToDistance())
    .on("data", (data: HitData) => {
        console.log(data);
    });