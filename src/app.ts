//load function on webpage load. Main entrypoint to the game application
import { Engine } from "../core/engine.js";

var engine: Engine;

window.onload = () => {
    engine=new Engine();
    engine.start("gameCanvas");
}

window.onresize = () => {
    engine.resize();
}
