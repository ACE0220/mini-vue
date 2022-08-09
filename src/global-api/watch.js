import Watcher from '../core/observer/watcher';

export function initWatchPrototype(Vue) {
    // 最终调用的api
    Vue.prototype.$watch = function(exprOrFn, cb) {
        // 监控的值变化,直接执行callback
        new Watcher(this, exprOrFn, {user: true}, cb)
    }
}