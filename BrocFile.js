// Brocfile.js
const funnel = require('broccoli-funnel');
const merge = require('broccoli-merge-trees');
const compileSass = require('broccoli-sass-source-maps')(require('sass'));
const Rollup = require("broccoli-rollup");
const babel = require("rollup-plugin-babel");
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const externals =  require('rollup-plugin-peer-deps-external');
const uglify =  require('rollup-plugin-uglify').uglify;

const appRoot = "test";

// Copy HTML file from app root to destination
const html = funnel(appRoot, {
  files: ["index.html"],
  annotation: "Index file",
});

console.log("__dirname=====", __dirname);

// Compile JS through rollup
let js = new Rollup(appRoot, {
  inputFiles: ["**/*.js", "**/*.jsx"],
  annotation: "JS Transformation",
  rollup: {
    input: {
      base: "base.jsx"
    },
    output: [
      {
        dir: 'client/assets/iife',
        format: 'iife',
        sourcemap: true
      }
    ],
    external: ['react', 'react-dom'],
    plugins: [
      externals(),
      nodeResolve({
        browser: true,
      }),
      commonjs({
        include: 'node_modules/**',
      }),
      babel({
        exclude: "node_modules/**",
        presets: [
          "@babel/env",
          "@babel/react"
        ],
        runtimeHelpers: true
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      uglify({
        output: {
          comments: false,
        },
        sourcemap: true
      })
    ],
  }
});

let serverJs = new Rollup('', {
  inputFiles: ["**/*.js", "**/*.jsx"],
  annotation: "JS Transformation",
  rollup: {
    input: "src/server.js",
    output: [
      {
        dir: 'server/assets/es',
        format: 'es',
        sourcemap: true
      },
      {
        dir: 'server/assets/umd',
        format: 'umd',
        sourcemap: true
      }
    ],
    plugins: [
      externals(),
      nodeResolve({
        jail: ['/src', '/lib'],
        preferBuiltins: true
      }),
      commonjs({
        include: 'node_modules/**',
      }),
      babel({
        exclude: "node_modules/**",
        presets: [
          "@babel/env",
          "@babel/react"
        ],
        runtimeHelpers: true
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
        "process.env.NODE_CONFIG_PATH": JSON.stringify(__dirname)
      }),
      // uglify({
      //   output: {
      //     comments: false,
      //   },
      //   sourcemap: true
      // })
    ],
  }
});

// Copy CSS file into assets
const css = compileSass(
    [appRoot],
    'styles/app.scss',
    'assets/app.css',
    {
      sourceMap: true,
      sourceMapContents: true,
      annotation: "Sass files"
    }
);

// Copy public files into destination
const public = funnel('public', {
  annotation: "Public files",
});

module.exports = merge([js, serverJs], {annotation: "Final output"});