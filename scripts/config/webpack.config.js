// process.env.NODE_ENV = 'development';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const paths = require('./paths');

module.exports = {
  entry: {
    // index: path.resolve(__dirname, 'src/index.js'),
    app: [ path.resolve(paths.src, 'index.js') ]
  },
  output: {
    path: paths.build,
    filename: "static/js/[name].[hash:8].js",
    publicPath: '/'
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
        use: [ 'file-loader' ]
      },
      {
        test: /\.jsx?$/,
        include: [ paths.src ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [ '@babel/env', '@babel/react' ]
            }
          }
        ],
      }
    ]
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(paths.public, 'index.html')
    }),
    new CleanWebpackPlugin(['build']),

    // 当接收到热更新信号时，在浏览器console控制台打印更多可读性高的模块名称等信息
    new webpack.NamedModulesPlugin(),

    // webpack全局热更新
    new webpack.HotModuleReplacementPlugin()
  ]
}