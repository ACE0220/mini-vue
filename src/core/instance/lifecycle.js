import { createElementVNode, createTextVNode } from "../../compiler/vdom";
import Watcher from "../observer/watcher";


function createElm(vNode) {
    let { tag, data, children, text } = vNode;
    if (typeof tag === 'string') {
        vNode.el = document.createElement(tag); // 将真实dom和虚拟dom对应起来，后续修改属性可以通过虚拟节点找到对应的真实节点
        
        patchProps(vNode.el, data);

        children.forEach(child => {
            vNode.el.appendChild(createElm(child));
        });
    } else {
        vNode.el = document.createTextNode(text);
    }
    return vNode.el;
}

function patchProps(el, props) {
    for(let key in props) {
        if(key === 'style') {
            for(let styleName in props.style) {
                el.style[styleName] = props.style[styleName]
            }
        } else {
            el.setAttribute(key, props[key]);
        }
    }
}

function patch(oldVNode, vNode) {
    const isRealElement = oldVNode.nodeType;
    if (isRealElement) {
        const elm = oldVNode; // 获取真实元素
        const parentElm = elm.parentNode; // 获取父元素
        let newElement = createElm(vNode);
        parentElm.insertBefore(newElement, elm.nextSibling)
        parentElm.removeChild(elm);
        return newElement;
    } else {
        // diff算法
    }
}

export function initLifeCycle(MiniVue) {
    // 将vNode转换成真实node
    MiniVue.prototype._update = function (vNode) {
        const vm = this;
        const el = vm.$el;
        // patch既有初始化也有更新的功能
        // 用vNode创建真实dom，再替换掉el
        vm.$el = patch(el, vNode);
    }
    // _c('div', {}, ...children)
    MiniVue.prototype._c = function () {
        return createElementVNode(this, ...arguments);
    }
    // _v(text)
    MiniVue.prototype._v = function () {
        return createTextVNode(this, ...arguments);
    }
    // _s()
    MiniVue.prototype._s = function (value) {
        if (typeof value !== 'object') return value;
        return JSON.stringify(value);
    }
    MiniVue.prototype._render = function () {
        const vm = this;
        // with函数中的this指向vm
        // 当渲染的时候回去实例中取值，就可以将视图和数据绑定
        return vm.$options.render.call(vm); // 通过ast语法转义生成的render函数
    }
}

export function mountComponent(vm, el) {
    vm.$el = el;
    // 1. 调用render方法生成虚拟dom
    // 2. 根据虚拟dom产生真实dom
    // 3. 插入到el元素
    callHook(vm, 'beforeMount')
    const updateComponent = function() {
        let render = vm._render();
        vm._update(render); // vm.$options.render() 虚拟节点
    }
    new Watcher(vm, updateComponent, true); 
    callHook(vm, 'mounted');
}

export function callHook(vm, hook) {
    console.log(hook);
}