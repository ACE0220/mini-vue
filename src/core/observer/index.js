import { newArrayProto } from "./array";
import Dep from "./dep";

class Observer{
    constructor(data) {
        this.dep = new Dep();
        Object.defineProperty(data, '__ob__', {
            enumerable: false,
            value: this
        })
        if(Array.isArray(data)) {
            data.__proto__ = newArrayProto;
            this.observerArray(data);
        } else {
            this.walk(data);
        }
    }
    walk(data) {
        Object.keys(data).forEach(key => defineReactive(data, key, data[key]));
    }
    observerArray(data) {
        data.forEach(item => observer(item));
    }
}

export function defineReactive(target, key, value) {
    if(!value) value = target[key];
    let dep = new Dep();
    observer(value);
    Object.defineProperty(target, key, {
        get() {
            if(Dep.target) {
                dep.depend();
            }
            return value;
        },
        set(newVal) {
          if(newVal === value) return;
          observer(newVal);
          value = newVal;
          dep.notify();
        }
    })
}

export function observer(data) {
    if(typeof data !== 'object' || data === null) return;
    return new Observer(data);
}

