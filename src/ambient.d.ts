declare global {
        type PropertyPanelUpdateHandler = {
            [key: string];
            legends: number,
            legends0: number,
            legends1: number,
            legends2: number,
            legends3: number,
            legends4: number,
            legends5: number,
            legends6: number,
            legends7: number,
            legends8: number,
            legends9: number,
            legends10: number,
            legends11: number,
            x: number,
            y: number,
            w: number,
            h: number,
            x2: number,
            y2: number,
            w2: number,
            h2: number,
            r: number,
            color: number,
            textColor: number,
            stepped: number,

        }
        type CapDataElement = {
            [key: string];
            legends: (string | null)[],
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
            decal: boolean,
            homing: boolean,
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