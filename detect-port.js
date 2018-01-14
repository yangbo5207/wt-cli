const detect = require('detect-port');
const clearConsole = require('react-dev-utils/clearConsole');
const getProcessForPort = require('react-dev-utils/getProcessForPort');
const chalk = require('chalk');
const inquirer = require('inquirer');

const DEFAULT_PORT = process.env.PORT || 3000;

const detectPort = spinner => new Promise((resolve, reject) => {
  detect(DEFAULT_PORT).then(port => {
    if (port === DEFAULT_PORT) {
      return resolve(port);
    }

    clearConsole();
    const existingProcess = getProcessForPort(DEFAULT_PORT);
    const question = [{
      name: 'shouldChangePort',
      type: 'confirm',
      message:
        '端口（' +
        chalk.yellow(DEFAULT_PORT) +
        '）被占用，可能的程序是： \n  ' +
        existingProcess +
        '\n' +
        '  要换一个端口运行本程序吗？',
      default: true
    }];

    spinner.stop();
    inquirer.prompt(question).then(({ shouldChangePort }) => {
      if (shouldChangePort) {
        resolve(port)
      } else {
        clearConsole();
        spinner.fail('请关闭占用' + chalk.yellow(DEFAULT_PORT) + '的程序后再运行。');
        console.log();
        process.exit(0);
      }
    })
  }, () => process.kill(process.pid, 'SIGINT'))
})

module.exports = detectPort;