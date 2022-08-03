const path = require('path');
const pkg = require('../package.json');
const base = require('./rollup.dev.config');

const resolve = function(...args) {
    return path.resolve(__dirname, ...args);
}

module.exports = {
    ...base,
    output: {
        file: resolve('../', pkg.output, "minivue.product.js"),
        name: 'MiniVue',
        format: 'umd',
        sourcemap: false
    }
}