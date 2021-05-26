import { gl, GLUtilities } from "./gl/gl.js";
import { shaders } from "./gl/shaders.js";


    /**
     * class for game-engine
     **/
    export class Engine {

        private _canvas: HTMLCanvasElement;
        private _shader: shaders;

        private _buffer: WebGLBuffer;

        //Constructor
        public constructor() {
            console.log("Engine constructed");
        }

        public start(elementId? : string):void {

            this._canvas = GLUtilities.initialize(elementId);

            gl.clearColor(0,0,0,1);

            this.loadShaders();
            this._shader.use();

            this.createBuffer();

            this.resize();
            this.tick();
        }

        public resize():void {
            if (this._canvas !== undefined) {

                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;

                gl.viewport(0 , 0, this._canvas.width, this._canvas.height);
            }
        }

        //Tick
        private tick():void {
            //gl reset every frame
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(0);

            gl.drawArrays(gl.TRIANGLES, 0, 3);

            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            gl.flush();

            //Bind the animation frame to the same instance of tick
            requestAnimationFrame(this.tick.bind(this));
        }

        private createBuffer():void {
            this._buffer = gl.createBuffer();

            let vertices = [
                //x,y,z
                0, 0, 0,
                0, 0.5, 0,
                0.5, 0.5, 0
            ];

            gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(0);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, undefined);
            gl.disableVertexAttribArray(0);
        }

        private loadShaders(): void {
            let vertexShaderSource = `
                attribute vec3 a_position;
                void main() {
                    gl_Position = vec4(a_position, 1.0);                
                }`;

            let fragmentShaderSource = `
                precision mediump float;
                void main () {
                    gl_FragColor = vec4(1.0);
                }`;

            this._shader = new shaders("basic", vertexShaderSource, fragmentShaderSource);
        }
    }
