declare global {
    type CapDataElement = {
        legends: string,
        x: number,
        y: number,
        width: number,
        height: number,
        x2: number,
        y2: number,
        width2: number,
        height2: number,
        color: string,
        fontColor: string,
        stepped: boolean
    }
    type FileData = {
        name: string,
        keyData: [CapDataElement]
    }
}
export {};