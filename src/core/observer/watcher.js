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
        console.log('update');
        this.get();
    }
}

export default Watcher;