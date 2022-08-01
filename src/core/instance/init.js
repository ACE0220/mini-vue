import { mountComponent } from "./lifecycle";
import { initState } from "./state";

export function initMixin(MiniVue) {
    MiniVue.prototype._init = function(options) {
        const vm = this;
        vm.$options = options;
        initState(vm);
        if(vm.$options.el) {
            vm.$mount(vm.$options.el);
        }
    }

    MiniVue.prototype.$mount = function(el) {
        const vm = this;
        mountComponent(vm, el);
    }
}