import { compileToFunction } from "../../compiler";
import { callHook, mountComponent } from "./liftcycle";
import { mergeOption } from "../../global-api/mixins";
import { initState } from "./state";

export function initMixin(Vue) {
    Vue.prototype._init = function(options) {
        const vm = this;
        vm.$options = mergeOption(this.constructor.options, options);
        callHook(vm, 'beforeCreate')
        initState(vm);
        callHook(vm, 'created')
        if(options.el) {
            vm.$mount(options.el);
        }
    }

    Vue.prototype.$mount = function(el) {
        const vm = this;
        el = document.querySelector(el);
        const opts = vm.$options;
        if(!opts.render) {
            let template
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

