import { compileToFunction } from "./compiler";
import { initMixin } from "./core/instance/init";
import { initLifeCycle } from "./core/instance/liftcycle";
import { nextTick } from "./core/observer/watcher";
import { initVueMixins } from "./global-api/mixins";
import { initWatchPrototype } from "./global-api/watch";
import { createElm, patch } from "./vdom/patch";

function Vue(options) {
    this._init(options);
}

Vue.prototype.$nextTick = nextTick;

initVueMixins(Vue);
initMixin(Vue);
initLifeCycle(Vue);
initWatchPrototype(Vue);

let render1 = compileToFunction(`<ul style="color:red">
    <li key='a'>a</li>
    <li key='b'>b</li>
    <li key='c'>c</li>
    <li key='d'>d</li>
</ul>`)
let vm1 = new Vue({
    data: {
        name: 'zf'
    }
})
let prevVNode = render1.call(vm1);
let el = createElm(prevVNode);
document.body.appendChild(el);

let render2 = compileToFunction(`<ul style="color:blue">
<li key='b'>b</li>
<li key='m'>m</li>
<li key='a'>a</li>
<li key='p'>p</li>
<li key='c'>c</li>
<li key='q'>q</li>
</ul>`)
let vm2 = new Vue({
    data: {
        name: 'zf'
    }
})
let nextVNode = render2.call(vm2);
setTimeout(() => {
    patch(prevVNode, nextVNode)
}, 1000)

export default Vue;