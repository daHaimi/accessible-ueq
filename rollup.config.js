import { babel } from '@rollup/plugin-babel';
import nodeResolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";

const config = {
    input: 'ueq-emotion.webcomponent.js',
    output: {
        dir: 'dist',
        entryFileNames: '[name].mjs',
        format: 'esm'
    },
    plugins: [
        nodeResolve(),
        json(),
        babel({
            babelHelpers: "inline",
        })
    ]
};

export default config;
