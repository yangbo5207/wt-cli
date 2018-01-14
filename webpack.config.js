const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    index: path.resolve(__dirname, 'src/index.js')
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: "static/js/[name].[hash:8].js",
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new CleanWebpackPlugin(['build']),

    // 当接收到热更新信号时，在浏览器console控制台打印更多可读性高的模块名称等信息
    new webpack.NamedModulesPlugin(),

    // webpack全局热更新
    new webpack.HotModuleReplacementPlugin()
  ]
}