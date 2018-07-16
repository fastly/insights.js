import assign from "./util/assign";
import * as Tasks from "./tasks/index";
import Runner from "./runner";

window.FASTLY = window.FASTLY || {};
window.FASTLY = assign(new Runner(Tasks), window.FASTLY);
