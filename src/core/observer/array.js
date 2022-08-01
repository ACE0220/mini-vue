const oldArrayProto = Array.prototype;

export const newArrayProto = Object.create(oldArrayProto);

const methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'sort',
    'splice'
]

methodsToPatch.forEach(method => {
    newArrayProto[method] = function(...args) { // 这里重写数组方法
        const result = oldArrayProto[method].call(this, ...args); // 内部调用原来方法，函数劫持，切片编程
        // 需要对新增的属性进行劫持
        let inserted;
        let ob = this.__ob__;
        switch(method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
            default:
                break;
        }
        // 对新增的内容再次进行劫持
        if(inserted) {
            ob.observerArray(inserted);
        }
        ob.dep.notify(); // 数组变化通知watcher更新
        return result;
    }
})