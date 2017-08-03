import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

export default {
  entry: 'src/index.js',
  format: process.env.FORMAT || 'cjs',
  moduleName: 'BitmapMin',
  sourceMap: true,
  plugins: [
    commonjs(),
    nodeResolve(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
  ],
  dest: `dist/bitmap-min${process.env.FORMAT ? '-' + process.env.FORMAT : ''}.js`,
}
