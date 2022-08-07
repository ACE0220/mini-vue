import { observer } from "../observer";

export function initState(vm) {
    const opts = vm.$options;
    if(opts.data) {
        initData(vm);
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