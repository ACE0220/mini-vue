import {initMixin} from './core/instance/init'

function MiniVue(options) {
    this._init(options);
}

initMixin(MiniVue)

export default MiniVue;


