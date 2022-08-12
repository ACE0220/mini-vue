import { initMixin } from "./core/instance/init";
import { initLifeCycle } from "./core/instance/liftcycle";
import { nextTick } from "./core/observer/watcher";
import { initGlobalAPI } from "./global-api";
import { initWatchPrototype } from "./global-api/watch";

function Vue(options) {
    this._init(options);
}

Vue.prototype.$nextTick = nextTick;

initGlobalAPI(Vue);
initMixin(Vue);
initLifeCycle(Vue);
initWatchPrototype(Vue);

export default Vue;