/* eslint-disable no-undef */
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { uglify } from 'rollup-plugin-uglify';
import dts from 'rollup-plugin-dts';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const pathsDotenv = resolveApp('.env');

dotenv.config({ path: `${pathsDotenv}.${process.env.NODE_ENV}` });

const sourcemap = process.env.SOURCEMAP === 'true';

const packagesDir = path.resolve(__dirname, 'packages');
const packageFiles = fs.readdirSync(packagesDir);
function output(path) {
  return [
    {
      input: [`./packages/${path}/src/index.ts`],
      output: [
        {
          file: `./packages/${path}/dist/index.cjs.js`,
          format: 'cjs',
          sourcemap,
        },
        {
          file: `./packages/${path}/dist/index.esm.js`,
          format: 'esm',
          sourcemap,
        },
        {
          file: `./packages/${path}/dist/index.js`,
          format: 'umd',
          name: 'web-see',
          sourcemap,
        },
        {
          file: `./packages/${path}/dist/index.min.js`,
          format: 'umd',
          name: 'web-see',
          sourcemap,
          plugins: [uglify()],
        },
      ],
      plugins: [
        typescript({
          tsconfigOverride: {
            compilerOptions: {
              module: 'ESNext',
            },
          },
          useTsconfigDeclarationDir: true,
        }),
        resolve(),
        commonjs(),
        json(),
      ],
    },
    {
      input: `./packages/${path}/src/index.ts`,
      output: [
        { file: `./packages/${path}/dist/index.cjs.d.ts`, format: 'cjs' },
        { file: `./packages/${path}/dist/index.esm.d.ts`, format: 'esm' },
        { file: `./packages/${path}/dist/index.d.ts`, format: 'umd' },
        { file: `./packages/${path}/dist/index.min.d.ts`, format: 'umd' },
      ],
      plugins: [dts()],
    },
  ];
}

export default [...packageFiles.map(path => output(path)).flat()];
