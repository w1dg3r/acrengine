import { gl } from "./gl.js"
/**
 * Vertex and fragment webGL shader class for the engine
 */
export class shaders {

    private _name: string;
    private _program: WebGLProgram;

    /**
     * 
     * @param name Name of shader
     * @param vertexPath The source of the vertexpath shader
     * @param fragmentPath The source of the fragmentpath shader
     */
    public constructor(name: string, vertexPath: string, fragmentPath : string) {
        this._name = name;
        let vertexShader = this.loadShader(vertexPath, gl.VERTEX_SHADER);
        let fragmentShader = this.loadShader(fragmentPath, gl.FRAGMENT_SHADER);

        this.createProgram(vertexShader, fragmentShader);
    }

    /**
     * Return name om shader
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Use this shader loaded in program
     */
    public use():void {
        gl.useProgram(this._program);
    }

    /**
     * 
     * @param source 
     * @param shaderType 
     * @returns 
     */
    private loadShader(source: string, shaderType: number) : WebGLShader {
        //Make a webglshader
        let shader: WebGLShader = gl.createShader(shaderType);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        let error = gl.getShaderInfoLog(shader);
        if (error !== "") {
            throw new Error("Error comipling shader " + this._name + ": " + error);
        }

        return shader;
    }

    /* Link shaders */
    private createProgram(vertexShader: WebGLShader, fragmentShader:WebGLShader): void {
        this._program = gl.createProgram();

        gl.attachShader(this._program, vertexShader);
        gl.attachShader(this._program, fragmentShader);

        gl.linkProgram(this._program);

        let error = gl.getProgramInfoLog(this._program);
        if (error !== "") {
            throw new Error("Error linking shader " + this._name + ": " + error);
        }
    }
}