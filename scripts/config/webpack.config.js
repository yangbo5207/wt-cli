const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const paths = require('./paths');
const _ = require('lodash');
const pkg = require(paths.pkg);

const publicPath = '/';

var entries = {};
_.each(paths.entries, (file, name) => {
  entries[name] = [file].concat('react-dev-utils/webpackHotDevClient')
})

var injects = [];
paths.pageEntries.forEach(name => {
  var chunks = ['vendor'];
  var file = path.resolve(paths.public, name + '.html');
  if (paths.entries[name]) {
    chunks.push(name);
  }

  injects.push(
    new HtmlWebpackPlugin({
      filename: name + '.html',
      template: file,
      inject: true,
      chunks
    })
  )
})

module.exports = {
  entry: Object.assign({}, entries, {
    vendor: [ 
      'react-dev-utils/webpackHotDevClient',  
      path.resolve(paths.src, 'print.js')
    ].concat(pkg.vendor || [])
  }),
  output: {
    path: paths.build,
    filename: "static/js/[name].[hash:8].js",
    publicPath: publicPath,
    pathinfo: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader', 'sass-loader' ]
      },
      {
        test: /\.s(c|a)ss$/,
        use: [ 'style-loader', 'css-loader', 'sass-loader' ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: 'file-loader'
      },
      {
        test: /\.jsx?$/,
        include: [ paths.src ],
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: ['@babel/env', '@babel/react']
        }
      }
    ]
  },
  // devtool: 'cheap-module-source-map',
  plugins: injects.concat([
    new CleanWebpackPlugin(paths.build, { allowExternal: true  }),

    // 当接收到热更新信号时，在浏览器console控制台打印更多可读性高的模块名称等信息
    new webpack.NamedModulesPlugin(),

    // webpack全局热更新
    new webpack.HotModuleReplacementPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    })
  ])
}