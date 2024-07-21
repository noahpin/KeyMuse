declare global {
        type CapDataElement = {
            [key: string];
            legends: string,
            x: number,
            y: number,
            w: number,
            h: number,
            x2: number,
            y2: number,
            w2: number,
            h2: number,
            r: number,
            color: string,
            textColor: string,
            stepped: boolean,
        }
        type FileData = {
            name: string,
            variables: [ColorVariable] | ColorVariable[],
            keyData: [CapDataElement] | CapDataElement[]
        }
        type ColorVariable = {
            id: string, 
            displayName: string,
            color: string
        }
    type CanvasRendererInput = {context: CanvasRenderingContext2D, width: number, height: number}
}
export {};