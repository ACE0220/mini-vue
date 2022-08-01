import Watcher from "../observer/watcher";

export function mountComponent(vm, el) {

    const updateComponent = function() {
        console.log(vm._data.testArr, 'updatecomponent');
    }

    new Watcher(vm, updateComponent, true);
}