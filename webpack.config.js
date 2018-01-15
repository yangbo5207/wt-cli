// process.env.NODE_ENV = 'development';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    // index: path.resolve(__dirname, 'src/index.js'),
    app: [ './src/index.js' ]
  },
  output: {
    path: path.resolve(__dirname, 'build'),
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
        include: [ path.resolve(__dirname, 'src') ],
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
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'public/index.html')
    }),
    new CleanWebpackPlugin(['build']),

    // 当接收到热更新信号时，在浏览器console控制台打印更多可读性高的模块名称等信息
    new webpack.NamedModulesPlugin(),

    // webpack全局热更新
    new webpack.HotModuleReplacementPlugin()
  ]
}