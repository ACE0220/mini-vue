import { observer } from "../observer";

export function initState(vm) {
    const options = vm.$options;
    if(options.data) {
        initData(vm);
    }
}

function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[target][key]
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
    // 将数据代理到vm上
    for(let key in data) {
        proxy(vm, '_data', key);
    }
}