import { gl, GLUtilities } from "./gl/gl.js";
import { shaders } from "./gl/shaders.js";


/**
 * class for game-engine
 **/
export class Engine {

    private _canvas: HTMLCanvasElement;
    private _shader: shaders;

    private _buffer: WebGLBuffer;
    private _positionAttributeLocation: number;
    private _angleLocation: WebGLUniformLocation;
    private _angle: number = 0;

    //Constructor
    public constructor() {
        console.log("Engine constructed");
    }

    public start(elementId?: string): void {

        this._canvas = GLUtilities.initialize(elementId);

        gl.clearColor(0, 0, 0, 1);

        this.loadShaders();
        this._shader.use();

        this.createBuffer();

        this.resize();
        this.tick();
    }

    public resize(): void {
        if (this._canvas !== undefined) {

            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;

            gl.viewport(0, 0, this._canvas.width, this._canvas.height);
        }
    }

    //Tick
    private tick(): void {
        //gl reset every frame
        gl.clear(gl.COLOR_BUFFER_BIT);

        this._angle += 0.05;
        gl.uniform1f(this._angleLocation, this._angle);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
        gl.vertexAttribPointer(this._positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this._positionAttributeLocation);

        gl.drawArrays(gl.TRIANGLES, 0, 3);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.flush();

        //Bind the animation frame to the same instance of tick
        requestAnimationFrame(this.tick.bind(this));
    }

    private createBuffer(): void {
        this._buffer = gl.createBuffer();

        let vertices = [
            //x,y,z
            0, 0, 0,
            0, 0.5, 0,
            0.5, 0.5, 0
        ];

        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
        gl.vertexAttribPointer(this._positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this._positionAttributeLocation);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, undefined);

        gl.disableVertexAttribArray(this._positionAttributeLocation);
    }

    private loadShaders(): void {
        let vertexShaderSource = `
                attribute vec3 a_position;
                uniform float u_angle;
                void main() {
                    float c = cos(u_angle);
                    float s = sin(u_angle);
                    gl_Position = vec4(a_position.x * c - a_position.y * s, a_position.x * s + a_position.y * c, a_position.z, 1.0);                
                }`;

        let fragmentShaderSource = `
                precision mediump float;
                void main () {
                    gl_FragColor = vec4(1.0);
                }`;

        this._shader = new shaders("basic", vertexShaderSource, fragmentShaderSource);
        this._positionAttributeLocation = this._shader.getAttributeLocation("a_position");
        this._angleLocation = this._shader.getUniformLocation("u_angle");
    }
}
