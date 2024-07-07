declare global {
    type CapDataElement = {
		[key: string]: string | undefined;
        legends: string,
        x: number,
        y: number,
        w: number,
        h: number,
        x2: number,
        y2: number,
        w2: number,
        h2: number,
        angle: number,
        color: string,
        fontColor: string,
        stepped: boolean,
    }
    type FileData = {
        name: string,
        keyData: [CapDataElement] | CapDataElement[]
    }
    type CanvasRendererInput = {context: CanvasRenderingContext2D, width: number, height: number}
}
export {};