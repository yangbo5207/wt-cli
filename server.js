const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const ora = require('ora');
var address = require('address');
const openBrowser = require('react-dev-utils/openBrowser');
const clearConsole = require('react-dev-utils/clearConsole');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const chalk = require('chalk');
const pkg = require('./package.json');

const check = require('./check');
const config = require('./webpack.config.js');

const host = 'localhost';

const spinner = ora('webpack正在启动中...').start();

let compiler = null;

const compilerStep = port => {
  var protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
  try {
    // config.entry.app.push(
    //   `webpack-dev-server/client?/`,
    //   "webpack/hot/dev-server"
    // )
    // the other way , only support in webpack 3.x
    config.entry.app.push(require.resolve('react-dev-utils/webpackHotDevClient'));
    compiler = webpack(config);
  } catch (err) {
    spinner.fail(chalk.red('编译失败'));
    console.log();
    console.log(err.message || err);
    console.log();
    process.exit(1);
  }

  // compiler 处于监视模式，并检测到文件更改。编译将很快开始
  compiler.plugin('invalid', () => {
    clearConsole();
    spinner.text = '重新编译...';
  })

  // all is done
  compiler.plugin('done', stats => {
    clearConsole();

    var messages = formatWebpackMessages(stats.toJson({}, true));
    if (!messages.errors.length && !messages.warnings.length) {
      spinner.succeed(chalk.green('编译通过！'));
      console.log();
      spinner.succeed(chalk.green('应用(' + pkg.name + ')已启动:'));
      console.log();
      console.log('本地：' + chalk.cyan(protocol + '://' + host + ':' + port + '/'));
      console.log('远程：' + chalk.cyan(protocol + '://' + address.ip() + ':' + port + '/'));
    }

    // If errors exist, only show errors.
    if (messages.errors.length) {
      spinner.fail(chalk.red('编译失败！！'));
      console.log();
      console.log(messages.errors.join('\n\n'));
    }

    // Show warnings if no errors were found.
    if (messages.warnings.length) {
      spinner.warn(chalk.yellow('编译有警告产生：'));
      console.log();
      console.log(messages.warnings.join('\n\n'));
      console.log();

      // Teach some ESLint tricks.
      console.log('搜索相关' + chalk.underline(chalk.yellow('关键词')) + '以了解更多关于警告产生的原因.');
      console.log(
        '如果要忽略警告, 可以将 ' + chalk.cyan('// eslint-disable-next-line') + ' 添加到产生警告的代码行上方'
      );
    }

    console.log();
    spinner.text = chalk.cyan('webpack运行中...');
    spinner.render().start();
  })
}

const options = {
  clientLogLevel: 'none',
  contentBase: 'public',
  hot: true,
  publicPath: config.output.publicPath,
  host: 'localhost',
  watchOptions: {
    ignored: /node_modules/
  },
  compress: true,
  quiet: true
};

check(spinner).then(port => {
  compilerStep(port);

  webpackDevServer.addDevServerEntrypoints(config, options);
  const server = new webpackDevServer(compiler, options);

  server.listen(port, host, (err, result) => {
    if (err) {
      console.log(err)
    }
    clearConsole();
    spinner.text = chalk.cyan('正在启动测试服务器...');
    console.log('dev server listening on port ' + port);
    openBrowser(`http://${host}:${port}/`);
  });
})

