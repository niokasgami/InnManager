import { terser } from 'rollup-plugin-terser';
import externalGlobals from "rollup-plugin-external-globals";

import { readFileSync } from 'fs';

import pkg from './package.json';

const header = readFileSync(`${__dirname}/dist/annotations2.js`)
                + '\n'
                + readFileSync('header.js', 'utf-8');
const dist = "dist/Project1/js/plugins";
export default [
	{
        input: 'src/InnManager/main.js',
        output: [
            {
                file: `${__dirname}/${dist}/${pkg.name}.js`,
                name: pkg.namespace,
                format: 'iife',
                sourcemap: false,
                plugins: [
                    terser({
                        format: {
                            comments: "all",
                            preamble: header
                        },
                        compress: false,
                        mangle: false
                    })
                ]
            },
            {
                file: `${pkg.testProjectDir || `${__dirname}/dist`}Project1/js/plugins/${pkg.name}.js`,
                name: pkg.namespace,
                format: 'iife',
                sourcemap: true,
                banner: header
            }
        ],
        plugins: [
            externalGlobals({
                "rmmz": "window",
                "pixi.js": "PIXI"
            })
        ]
	}
];
