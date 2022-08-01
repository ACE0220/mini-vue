import Dep from "./dep";

let id = 0;

// 渲染watcher
class Watcher { // 不同组件不同watcher
    constructor(vm, fn, options) { // fn 渲染函数
        this.id = id++;
        this.renderWatcher = options;
        this.getter = fn; // getter调用发生取值操作
        this.deps = []; // 计算属性和清理工作需要用到
        this.depsID = new Set();
        this.get();
    }
    get() {
        Dep.target = this;
        this.getter(); // vm取值
        Dep.target = null;
    }
    // 一个组件对应多个属性，重复属性也不用记录
    addDep(dep) {
        let id = dep.id;
        if (!this.depsID.has(id)) {
            this.deps.push(dep);
            this.depsID.add(id);
            dep.addSub(this); // watcher记住dep并且已经去重，dep也记住了watcher
        }
    }
    update() {
        queueWatcher(this); // 把当前watch暂存起来
    }

    run() {
        this.get();
    }
}

let queue = [];
let has = {};
let pedding = false; // 防抖

function flushSchedulerQueue() {
    let flushQueue = queue.slice(0);
    for(let i = 0; i < flushQueue.length; i++) {
        flushQueue[i].run();
    }
    queue = [];
    has = {};
    pedding = false;
}


function queueWatcher(watcher) {
    const id = watcher.id;
    if (!has[id]) {
        queue.push(watcher);
        has[id] = true;
        // 不管update多少次，最终只执行一次一轮刷新操作
        if(!pedding) {
            nextTick(flushSchedulerQueue, 0)
            pedding = true;
        }
    }
}


let callbacks = [];
let waiting = false;
function flushCallbacks() {
    let cbs = callbacks.slice(0);
    waiting = false;
    callbacks = [];
    cbs.forEach(cb => cb());
}

export function nextTick(cb) {
    callbacks.push(cb); // 维护nextTick的callback
    if(!waiting) {
        Promise.resolve().then(flushCallbacks);
        waiting = true;
    }
}

// 给每个属性增加一个dep，目的就是收集watcher
// 一个视图中,n个dep对应一个watcher
// 一个属性也可以对应多个组件
// 多对多的关系

export default Watcher;