import { createElmVNode, createTextVNode } from "../../vdom";
import { patch } from "../../vdom/patch";
import Watcher from "../observer/watcher";

export function initLifeCycle(Vue) {
    Vue.prototype._update = function(vnode) {
        const vm = this;
        const el = vm.$el;

        
        const prevVNode = vm._vnode;
        vm._vnode = vnode; // 组件第一次产生的虚拟节点保存到_vnode
        if(prevVNode) { // 之前渲染过了
            vm.$el = patch(prevVNode, vnode);
        } else {
            vm.$el = patch(el, vnode);
        }
        


        
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
    const updateComponent = function() {
        vm._update(vm._render());
    }
    new Watcher(vm, updateComponent, true)
}

export function callHook(vm, hook) {
    const handlers = vm.$options[hook];
    if(handlers) {
        handlers.forEach(element => {
            element.call(vm)
        });
    }
}