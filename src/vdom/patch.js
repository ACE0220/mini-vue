function createElm(vnode) {
    let {tag, data, children, text} = vnode;
    if(typeof tag === 'string') {
        vnode.el = document.createElement(tag);

        patchProps(vnode.el, data);

        children.forEach(element => {
            vnode.el.appendChild(createElm(element));
        });
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el;
}

function patchProps(el, props) {
    for(let key in props) {
        if(key === 'style') {
            for(let styleName in props[key]) {
                el.style[styleName] = props.style[styleName]
            }
        } else {
            el.setAttribute(key, props[key])
        }
    }
}

export function patch(oldVNode, vnode) {
        const isRealElement = oldVNode.nodeType;
        if(isRealElement) {
            const elm = oldVNode;
            const parentElm = elm.parentNode;
            let newElm = createElm(vnode);
            parentElm.insertBefore(newElm, elm.nextSibling)
            parentElm.removeChild(elm);
            return newElm;
        } else {
            // diff
        }
}