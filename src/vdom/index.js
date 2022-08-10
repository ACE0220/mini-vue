export function createElmVNode(vm, tag, data, ...children) {
    if(data === null) {
        data = {}
    }
    let key = data.key;
    if(key) {
        delete data.key;
    }
    
    return vnode(vm, tag, key, data, children)
}

export function createTextVNode(vm ,text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
}

function vnode(vm, tag, key, data, children, text, ) {
    return {
        vm,
        tag,
        key,
        data,
        children,
        text
    }
}

export function isSameVNode(vnode1, vnode2) {
    return vnode1.tag === vnode2.tag && vnode1.key === vnode2.key;
}