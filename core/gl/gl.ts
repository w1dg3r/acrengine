
    export let gl: WebGL2RenderingContext;

    export class GLUtilities {

        public static initialize(elementId?: string): HTMLCanvasElement {
            let canvas: HTMLCanvasElement;

            if (elementId !== undefined) {
                canvas = <HTMLCanvasElement>document.getElementById(elementId);
                if (canvas === undefined) {
                    throw new Error("Cannot find a canvas element named: "+ elementId);
                }
            }
            else {
                elementId = "GameCanvas";
                canvas = <HTMLCanvasElement>document.createElement(elementId);
                document.body.appendChild(canvas);
            }

            gl = <WebGL2RenderingContext>canvas.getContext("webgl2");
            if (gl === undefined) {
                throw new Error("Unable to initialize WebGL2");

            }

            return canvas;
        }
    }

