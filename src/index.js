import { initMixin } from "./core/instance/init";

function Vue(options) {
    this._init(options);
}

initMixin(Vue);

export default Vue;