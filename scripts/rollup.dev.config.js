const path = require('path');
const babel = require('rollup-plugin-babel');
const {nodeResolve} = require('@rollup/plugin-node-resolve');
const pkg = require('../package.json');

const extensions = ['.js'];

const resolve = function(...args) {
    return path.resolve(__dirname, ...args);
}

module.exports = {
    input: pkg.main,
    output: {
        file: resolve('../', pkg.output, "minivue.dev.js"),
        name: "Vue",
        format: 'umd',
        sourcemap: true
    },
    plugins: [
        nodeResolve({
            extensions,
            modulesOnly: true
        }),
        babel({
            exclude: 'node_modules/**',
            extensions,
        }),
    ]
}