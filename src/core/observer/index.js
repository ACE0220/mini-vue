import { newArrayProto } from "./array";
import Dep from "./dep";

class Observer{
    constructor(data) {
        Object.defineProperty(data, '__ob__', {
            value: this,
            enumerable: false
        })
        if(Array.isArray(data)) {
            data.__proto__ = newArrayProto;
            this.observeArray(data);
        } else {
            this.walk(data);
        }
    }
    walk(data) {
        Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
    }
    observeArray(data) {
        data.forEach(item => observer(item))
    }
}

export function observer(data) {
    if(typeof data !== 'object' || data === null) return;
    if(data.__ob__ instanceof Observer) return data.__ob__;
    return new Observer(data);
}

export function defineReactive(target, key, value) {
    observer(value);
    let dep = new Dep();
    Object.defineProperty(target, key, {
        get() {
            if(Dep.target) {
                dep.depend();
            }
            return value;
        },
        set(newVal) {
            if(value === newVal) return;
            observer(newVal)
            value = newVal;
            dep.notify();
        }
    })
}