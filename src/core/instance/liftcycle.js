import { createElmVNode, createTextVNode } from "../../vdom";
import { patch } from "../../vdom/patch";

export function initLifeCycle(Vue) {
    Vue.prototype._update = function(vnode) {
        const vm = this;
        const el = vm.$el;
        vm.$el = patch(el, vnode);
    }
    Vue.prototype._c = function() {
        return createElmVNode(this, ...arguments);
    }
    Vue.prototype._v = function() {
        return createTextVNode(this, ...arguments);
    }
    Vue.prototype._s = function(value) {
        if(typeof value !== 'object') return value;
        return JSON.stringify(value);
    }
    Vue.prototype._render = function() {
        const vm = this;
        return vm.$options.render.call(vm);
    }
}

export function mountComponent(vm, el) {
    vm.$el = el;
    vm._update(vm._render());
}