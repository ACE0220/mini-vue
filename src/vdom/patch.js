import { isSameVNode } from ".";

export function createElm(vnode) {
    let { tag, data, children, text } = vnode;
    if (typeof tag === 'string') {
        vnode.el = document.createElement(tag);

        patchProps(vnode.el, {}, data);

        children.forEach(element => {
            vnode.el.appendChild(createElm(element));
        });
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el;
}

function patchProps(el, oldProps = {}, props = {}) {
    // 老的属性中有，新的没有
    let oldStyles = oldProps.style || {};
    let newStyles = props.style || {};
    for (let key in oldStyles) {
        if (!newStyles[key]) {  // 样式：老有新没有则删除
            el.style[key] = ''
        }
    }

    for (let key in oldProps) { // 属性：老有新没有则删除
        if (!props[key]) {
            el.removeAttribute(key);
        }
    }

    for (let key in props) { // 新覆盖老
        if (key === 'style') {
            for (let styleName in props[key]) {
                el.style[styleName] = props.style[styleName]
            }
        } else {
            el.setAttribute(key, props[key])
        }
    }


}

export function patch(oldVNode, vnode) {
    const isRealElement = oldVNode.nodeType;
    // 初渲染流程
    if (isRealElement) {
        const elm = oldVNode;
        const parentElm = elm.parentNode;
        let newElm = createElm(vnode);
        parentElm.insertBefore(newElm, elm.nextSibling)
        parentElm.removeChild(elm);
        return newElm;
    } else {
        // diff算法是一个平级比较的过程，父亲和父亲比对，儿子和儿子比对
        // 1. 两个节点不同，删除老的换上新的
        // 2. 两个节点是同一个节点，判断节点的tag和key，比较节点属性差异，复用老的节点，将差异属性更新
        // 3. 节点比较完毕就需要比较儿子
        return patchVNode(oldVNode, vnode)
    }
}

function patchVNode(oldVNode, vnode) {
    if (!isSameVNode(oldVNode, vnode)) {
        // 用老节点的父亲进行替换
        let el = createElm(vnode);
        oldVNode.el.parentNode.replaceChild(el, oldVNode.el);
        return el;
    }

    // 文本
    let el = vnode.el = oldVNode.el; // 复用老节点的元素
    if (!oldVNode.tag) {
        if (oldVNode.text !== vnode.text) {
            el.textContent = vnode.text; // 新文本覆盖老的
        }
    }

    patchProps(el, oldVNode.data, vnode.data);

    // 比较儿子节点，一方有一方无，两方都有两种情况
    let oldChildren = oldVNode.children || [];
    let newChildren = vnode.children || [];
    if (oldChildren.length > 0 && newChildren.length > 0) {
        updateChildren(el, oldChildren, newChildren)
    } else if (newChildren.length > 0) { // 老的没有儿子，新的有儿子,要插入
        mountChildren(el, newChildren);
    } else if (oldChildren.length > 0) { // 老的有儿子，新的没有，要删除
        el.innerHTML = '';
    }

    return el;
}

function mountChildren(el, newChildren) {
    for (let i = 0; i < newChildren.length; i++) {
        let child = newChildren[i];
        el.appendChild(createElm(child));
    }
}

function updateChildren(el, oldChildren, newChildren) {

    // 操作列表会有push，pop，shift等方法
    // 在vue2中采用双指针方式比较节点
    let oldStartIndex = 0;
    let newStartIndex = 0;
    let oldEndIndex = oldChildren.length - 1;
    let newEndIndex = newChildren.length - 1;

    let oldStartVNode = oldChildren[0];
    let newStartVNode = newChildren[0];
    let oldEndVNode = oldChildren[oldEndIndex];
    let newEndVNode = newChildren[newEndIndex];

    function makeIndexByKey(children) {
        let map = {};
        children.forEach((child, index) => {
            map[child.key] = index;
        })
        return map;
    }

    let map = makeIndexByKey(oldChildren);

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        // 任意一方头指针大于尾指针停止循环
        if (!oldStartVNode) {
            oldStartVNode = oldChildren[++oldStartIndex];
        } else if (!oldEndVNode) {
            oldEndVNode = oldChildren[--oldEndIndex];
        }
        // 头头比对
        else if (isSameVNode(oldStartVNode, newStartVNode)) {
            patchVNode(oldStartVNode, newStartVNode); // 如果相同节点则递归比较子节点
            oldStartVNode = oldChildren[++oldStartIndex];
            newStartVNode = newChildren[++newStartIndex];
        }

        // 尾尾比对
        else if (isSameVNode(oldEndVNode, newEndVNode)) {
            patchVNode(oldEndVNode, newEndVNode); // 如果相同节点则递归比较子节点
            oldEndVNode = oldChildren[--oldEndIndex];
            newEndVNode = newChildren[--newEndIndex];
        }

        // 交叉比对尾头
        else if (isSameVNode(oldEndVNode, newStartVNode)) {
            patchVNode(oldEndVNode, newStartVNode);
            // insertBefore具备移动性,会将原来的元素移走
            el.insertBefore(oldEndVNode.el, oldStartVNode.el); // 老的尾巴移动到老的前面
            oldEndVNode = oldChildren[--oldEndIndex];
            newStartVNode = newChildren[++newStartIndex];

        }
        // 交叉比对头尾
        else if (isSameVNode(oldStartVNode, newEndVNode)) {
            patchVNode(oldStartVNode, newEndVNode);
            // insertBefore具备移动性,会将原来的元素移走
            el.insertBefore(oldEndVNode.el, oldEndVNode.el.nextSibling);
            oldStartVNode = oldChildren[++oldStartIndex];
            newEndVNode = newChildren[--newEndIndex];
        } else {
            // 给动态列表添加key的时候，避免使用索引，索引都是从0开始，可能会发生错误复用
            // 乱序对比，根据老的列表做一个映射关系，用新的去找，找到则移动，找不到则添加，多余的删除

            let moveIndex = map[newStartVNode.key]; // 如果拿到则是要移动的索引
            if (moveIndex != undefined) {
                let moveVNode = oldChildren[moveIndex]; // 找到对应的虚拟节点，复用
                el.insertBefore(moveVNode.el, oldStartVNode.el);
                oldChildren[moveIndex] = undefined; // 标识节点已经移走
                patchVNode(moveVNode, newStartVNode); // 对比属性和子节点
            } else {
                el.insertBefore(createElm(newStartVNode), oldStartVNode.el);
            }
            newStartVNode = newChildren[++newStartIndex];
        }
    }

    if (newStartIndex <= newEndIndex) { // 新的多的插入
        for (let i = newStartIndex; i <= newEndIndex; i++) {
            let childEl = createElm(newChildren[i]);
            // 可能是向后追加或者向前追加
            let anchor = newChildren[newEndIndex + 1] ? newChildren[newEndIndex + 1].el : null;
            el.insertBefore(childEl, anchor);
        }
    }

    if (oldStartIndex <= oldEndIndex) { // 老的多余的删掉
        for (let i = oldStartIndex; i <= oldEndIndex; i++) {
            if (oldChildren[i]) {
                let childEl = oldChildren[i].el;
                el.removeChild(childEl)
            }
        }
    }

    // console.log(oldStartVNode, newStartVNode, oldEndVNode, newEndVNode);
}