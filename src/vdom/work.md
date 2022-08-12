```
function extend(选项) {
    function Sub() {
        this._init(); // 子组件初始化
    }
    Sub.options = 选项
    return Sub;
}

let Sub = Vue.extend({
    data: 数据源
})

new Sub() mergeOptions(Sub.options) Sub.options.data  // 如果是data是一个对象，就是共享的
new Sub() mergeOptions(Sub.options) Sub.options.data
```

- 如果子组件的data是一个对象，是共享的了，所以data只能是函数，通过执行data函数达到组件之间data独立

- 创建子类构造函数，会将全局的组件和自己身上定义的组件合并
- 组件的渲染 开始渲染组件会编译组件的模板成render函数 -> 调用render方法
- createElementVNode根据tag类型区分是否组件，是组件则创建组件的虚拟节点，组件增加初始化钩子函数，增加componentOptions选项ctor，稍后创建组件的真实节点，只需要new ctor()
- 创建真实节点