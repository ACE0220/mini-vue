
// 创建元素的虚拟节点 _c
export function createElementVNode(vm ,tag, data = {}, ...children) {
    if(data === null) {
        data = {}
    }
    let key = data.key;
    if(key) {
        delete data.key;
    }
    return vNode(vm, tag, key, data, children);
}

// 创建{{}}变量类型虚拟节点 _v
export function createTextVNode(vm ,text) {
    return vNode(vm, undefined, undefined, undefined, undefined, text);
}

// ast做的是语法层面的转换,描述语法本身
// vNode描述的是dom元素，可以增加一些自定义属性
function vNode(vm , tag, key, data, children, text) {
    return {
        vm,
        tag,
        key, 
        data,
        children,
        text,
    }
}