import { initMixin } from "./core/instance/init";
import { initLifeCycle } from "./core/instance/liftcycle";
import { initVueMixins } from "./core/instance/mixins";
import { nextTick } from "./core/observer/watcher";

function Vue(options) {
    this._init(options);
}

Vue.prototype.$nextTick = nextTick;

initVueMixins(Vue);
initMixin(Vue);
initLifeCycle(Vue);


export default Vue;