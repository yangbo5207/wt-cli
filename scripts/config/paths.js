const path = require('path');
const fs = require('fs');
const glob = require('glob');

// cwd  执行当前命令的文件夹的地址
// __dirname 当前文件的文件夹地址
const appDirectory = fs.realpathSync(process.cwd());  // /Users/yangbo/develop/wt-cli

const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

// 可能会出现的一些模块文件夹，将会在resolve.modules中配置
const nodePaths = (process.env.NODE_PATH || '')
  .split(process.platform === 'win32' ? ';' : ':')
  .filter(Boolean)
  .map(resolveApp);

// 为多页系统提供入口，遍历src中的js文件，每个js文件将会对应同名的html文件成为一个页面
const entries = {};

glob.sync(resolveApp('src/!(_)*.js?(x)')).forEach(file => {
  const basename = path.basename(file).replace(/\.jsx?$/, '');
  entries[basename] = file;
})

/*
entries = {
  index: '/Users/yangbo/develop/wt-cli/src/index.js',
  free: '/Users/yangbo/develop/wt-cli/src/free.js',
  ...
}
*/

// 在public文件夹中遍历html文件，每个html将会成为一个页面
const pageEntries = glob.sync(resolveApp('public/!(_)*.html'))
  .map(file => path.basename(file, '.html')); // index.html -> index

// 别名
const alias = {
  components: resolveApp('src/components'),
  pages: resolveApp('src/pages'),
  utils: resolveApp('src/utils')
}

module.exports = {
  root: resolveApp(''),
  build: resolveApp('build'),
  public: resolveApp('public'),
  appHTML: resolveApp('public/index.html'),
  pkg: resolveApp('package.json'),
  src: resolveApp('src'),
  static: resolveApp('static'),
  nodeModules: resolveApp('node_modules'),
  nodePaths: nodePaths,
  alias: alias,
  entries: entries,
  pageEntries: pageEntries
}