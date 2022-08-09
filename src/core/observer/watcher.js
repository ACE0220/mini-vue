import Dep from "./dep";

let id = 0;

class Watcher {
    constructor(vm, fn, option) {
        this.id = id++;
        this.renderWatcher = option;
        this.getter = fn;
        this.deps = [];
        this.depsID = new Set();
        this.get();
    }
    get() {
        Dep.target = this;
        this.getter();
        Dep.target = null;
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
        queueWatcher(this);
    }
    run() {
        this.get();
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