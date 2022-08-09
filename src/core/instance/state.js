import { observer } from "../observer";
import Dep from "../observer/dep";
import Watcher from '../observer/watcher';

export function initState(vm) {
    const opts = vm.$options;
    if (opts.data) {
        initData(vm);
    }
    if (opts.computed) {
        initComputed(vm);
    }
}

function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[target][key];
        },
        set(newVal) {
            vm[target][key] = newVal;
        }
    })
}

function initData(vm) {
    let data = vm.$options.data;
    data = typeof data === 'function' ? data.call(vm) : data;
    vm._data = data;
    observer(data);

    Object.keys(data).forEach(key => {
        proxy(vm, '_data', key)
    })
}

function initComputed(vm) {
    const computed = vm.$options.computed;
    const watchers = vm._computedWatchers = {};
    for (let key in computed) {
        let userDef = computed[key];
        const getter = typeof userDef === 'function' ? userDef : userDef.get;
        watchers[key] = new Watcher(vm, getter, {lazy: true});
        defineComputed(vm, key, userDef);
    }
}

function defineComputed(target, key, userDef) {
    const setter = userDef.set || (() => { })
    Object.defineProperty(target, key, {
        get: createComputedGetter(key),
        set: setter
    })
}

function createComputedGetter(key) {
    // 检测是否执行getter
    return function() {
        const watcher = this._computedWatchers[key]
        if(watcher.dirty) {
            watcher.evaluate();
        }
        if(Dep.target) { // 计算属性出站后，还要渲染watcher，应该让计算属性watcher里面的属性也去收集上一层watcher
            watcher.depend();
        }
        return watcher.value;
    }
}