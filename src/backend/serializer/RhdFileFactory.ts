import * as fs from "fs";
import * as util from "util";

export class RhdFileFactory {
    public static async createFromFile(filePath: string) {
        fs.open(filePath, "r", async (error, fileHandle) => {
            if (error) {
                throw error;
            }

            const read = util.promisify(fs.read);
            const buffer = Buffer.alloc(13);
                
            const result = await read(fileHandle, buffer, 0, 13, 0);

            if (result.bytesRead != 13) {
                throw Error("EOF reached");
            }

            // const arrayBuffer = buffer.buffer;
            // const view = new DataView(arrayBuffer);

            // const timestamp = Number(view.getBigUint64(0));
            

        });
    }
}