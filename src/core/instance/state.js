import { observer } from "../observer";

export function initState(vm) {
    const options = vm.$options;
    if(options.data) {
        initData(vm);
    }
}


function initData(vm) {
    let data = vm.$options.data;
    data = typeof data === 'function' ? data.call(vm) : data;
    vm._data = data;
    observer(data);
}