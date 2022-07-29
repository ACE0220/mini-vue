
export function initMixin(MiniVue) {
    MiniVue.prototype._init = function(options) {
        this.$options = options;
    }
}