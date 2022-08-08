import { initMixin } from "./core/instance/init";
import { initLifeCycle } from "./core/instance/liftcycle";

function Vue(options) {
    this._init(options);
}

initMixin(Vue);
initLifeCycle(Vue);

export default Vue;