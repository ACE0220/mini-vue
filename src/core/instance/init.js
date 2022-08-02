import { compileToFunction } from "../../compiler";
import { callHook, mountComponent } from "./lifecycle";
import { initState } from "./state";

export function initMixin(MiniVue) {
    MiniVue.prototype._init = function(options) {
        const vm = this;
        vm.$options = options;
        callHook(vm, 'beforeCreate')
        initState(vm);
        callHook(vm, 'created')
        if(vm.$options.el) {
            vm.$mount(vm.$options.el);
        }
    }

    MiniVue.prototype.$mount = function(el) {
        const vm = this;
        el = document.querySelector(el);
        let opts = vm.$options;
        if(!opts.render) {
            let template;
            if(!opts.template && el) {
                template = el.outerHTML;
            } else {
                if(el) {
                    template = opts.template;
                }
            }
            if(template) {
                const render = compileToFunction(template);
                opts.render = render;
            }
        }
        mountComponent(vm, el);
    }
}