class Observer{
    constructor(data) {
        this.walk(data);
    }
    walk(data) {
        Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
    }
}

export function observer(data) {
    if(typeof data !== 'object' || data === null) return;
    return new Observer(data);
}

export function defineReactive(target, key, value) {
    observer(value);
    Object.defineProperty(target, key, {
        get() {
            return value;
        },
        set(newVal) {
            if(value === newVal) return;
            value = newVal;
        }
    })
}