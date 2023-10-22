import { FftData, FftTransformer } from "./fft_transformer";
import { PhaseData, Radar } from "./radar"
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { createServer  } from "http";
import { Server } from "socket.io";
import { HitData, HitFinder } from "./hit_finder";

const r = new Radar("COM3");
const hp = new HitFinder(r);

export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    phaseData: (phaseData: PhaseData) => void;
    fftData: (fftData: FftData) => void;
    fftDataRemote: (fftData: FftData) => void;
  }
  
  export interface ClientToServerEvents {
    hello: () => void;
  }
  
  interface InterServerEvents {
    ping: () => void;
  }
  
  interface SocketData {
    name: string;
    age: number;
  }


dotenv.config();

const app: Express = express();
app.use(express.static('./dist/frontend'));
const http = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(http, {serveClient: true, path: "/socket.io/"});

const port = process.env.PORT;

io.on("connection", (socket) => {
  r.on('fftData', (fftData: FftData) => {
    socket.emit("fftDataRemote", fftData);
  });

  hp.on('hitData', (hitData: HitData) => {
    console.log(hitData.toString());
  })
});

 http.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
