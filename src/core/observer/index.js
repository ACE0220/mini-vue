import { newArrayProto } from "./array";
import Dep from "./dep";

class Observer{
    constructor(data) {
        this.dep = new Dep();
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

function dependArray(value) {
    for(let i = 0; i < value.length; i++) {
        let current = value[i];
        current.__ob__ && current.__ob__.dep.depend();
        if(Array.isArray(current)) {
            dependArray(current);
        }
    }
}

export function defineReactive(target, key, value) {
    let childOb = observer(value);
    let dep = new Dep();
    Object.defineProperty(target, key, {
        get() {
            if(Dep.target) {
                dep.depend();
                if(childOb) {
                    childOb.dep.depend();
                    if(Array.isArray(value)) {
                        dependArray(value)
                    }
                }
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