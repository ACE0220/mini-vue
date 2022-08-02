import {initMixin} from './core/instance/init'
import { initLifeCycle } from './core/instance/lifecycle';

function MiniVue(options) {
    this._init(options);
}

initMixin(MiniVue);
initLifeCycle(MiniVue);

export default MiniVue;


