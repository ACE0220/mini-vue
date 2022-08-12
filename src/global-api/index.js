import { mergeOption } from "../core/instance/utils";

export function initGlobalAPI(Vue) {
    Vue.options = {
        _base: Vue
    };
    Vue.mixin = function (mixin) {
        this.options = mergeOption(this.options, mixin);
        return this;
    }

    Vue.extend = function(options) {

        // 最终使用一个组件就是new一个实例
        function Sub(options = {}){
            this._init(options); // 默认对子类进行初始化
        }
        Sub.prototype = Object.create(Vue.prototype);
        Sub.prototype.constructor = Sub;
        // 用户传递的参数和全局的Vue.options合并
        Sub.options = mergeOption(Vue.options, options); // 保存用户传递的选项
        return Sub;
    }
    Vue.options.components = {}; // 全局指令 Vue.options.directives
    Vue.component = function(id, definition) {

        // 如果defenition已经是一个函数了，说明用户自己调用了Vue.extend
        definition = typeof definition === 'function' ? definition : Vue.extend(definition)
        Vue.options.components[id] = definition;

        console.log(Vue.options.components);
    }
}