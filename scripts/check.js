const checkDependencies = require('check-dependencies');
const inquirer = require('inquirer');
const fse = require('fs-extra');
const chalk = require('chalk');

const detectPort = require('./detect-port');

const check = spinner => new Promise((resolve, reject) => {
  checkDependencies({}, result => {
    if (result.status) { // 0: success   1: has diff
      spinner.stop();
      result.error.forEach(err => console.log(err));
      
      inquirer.prompt([{
        name: 'reInstall',
        type: 'confirm',
        message: '你当前安装的依赖版本与package.json中的不一致，是否需要重新安装依赖？ \n' + 
          chalk.dim('1. 删除 node_modules 目录.') +
          '\n' +
          chalk.dim('2. 重新运行 npm install 安装所有依赖项.') +
          '\n',
        default: false
      }]).then(answers => {
        if (answers.reInstall) {
          spinner.text = '删除 node_modules 目录中 ...';
          spinner.start();
          fse.removeSync('./node_modules');
          spinner.succeed('删除 node_modules 目录成功！');
          console.log('请运行下面的命令重新安装依赖：');
          console.log(chalk.green(' cnpm/npm install'));
        } else {
          console.log();
          spinner.warn(chalk.yellow('你需要按照下面命令操作后才能继续：'));

          console.log();
          console.log(chalk.green(' rm -rf node_modules'));
          console.log(chalk.green(' cnpm/npm install'));
        }
      })
    } else {
      detectPort(spinner).then(port => resolve(port))
    }
  })
})

module.exports = check;