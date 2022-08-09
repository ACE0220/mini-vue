import Dep, { popTarget, pushTarget } from "./dep";

let id = 0;

class Watcher {
    constructor(vm, exprOrFn, option, cb) {
        this.vm = vm;
        this.id = id++;
        this.renderWatcher = option;
        if(typeof exprOrFn === 'string') {
            this.getter = function() {
                return vm[exprOrFn];
            }
        } else {
            this.getter = exprOrFn;
        }
        
        this.cb = cb;
        this.deps = [];
        this.depsID = new Set();
        this.lazy = option.lazy;
        this.dirty = this.lazy;
        this.user = option.user; // 标识是不是用户自己的watcher
        this.value = this.lazy ? undefined : this.get();
    }
    evaluate() {
        this.value = this.get(); // 获取用户函数返回值，标识为脏
        this.dirty = false;
    }
    get() {
        pushTarget(this)
        let value = this.getter.call(this.vm);
        popTarget();
        return value;
    }
    addDep(dep) {
        let id = dep.id;
        if(!this.depsID.has(id)) {
            this.deps.push(dep);
            this.depsID.add(id);
            dep.addSub(this)
        }
    }
    update() {
        if(this.lazy) {
            this.dirty = true;
        } else {
            queueWatcher(this);
        }
        
    }
    run() {
        let oldValue = this.value;
        let newValue = this.get();
        if(this.user) {
            this.cb.call(this.vm, newValue, oldValue);
        }
    }
    depend() {
        let i = this.deps.length;
        while(i--) {
            this.deps[i].depend(); // 让计算属性watcher收集渲染watcher
        }
    }
}

let queue = [];
let has = {};
let pending = false;

function flushSchedulerQueue() {
    let flushQueue = queue.slice(0);
    queue = [];
    has = {};
    pending = false;
    flushQueue.forEach(q => q.run());
}

function queueWatcher(watcher) {
    const id = watcher.id;
    if(!has[id]) {
        queue.push(watcher);
        has[id] = true;
        if(!pending) {
            nextTick(flushSchedulerQueue, 0);
            pending = true;
        }
    }
}

let callback = [];
let waiting = false;
function flushCallbacks() {
    waiting = false;
    let cbs = callback.slice(0);
    callback = [];
    cbs.forEach(cb => cb());
}
export function nextTick(cb) {
    callback.push(cb);
    if(!waiting) {
        Promise.resolve().then(flushCallbacks)
        waiting = true;
    }
}

export default Watcher;