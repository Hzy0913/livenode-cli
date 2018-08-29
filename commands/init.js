const {prompt} = require('inquirer')
const chalk = require('chalk')
const download = require('download-git-repo')
const ora = require('ora')
const fs = require('fs')

let tplList = require(`${__dirname}/../templates`)
const question = [
  {
    type: 'input',
    name: 'name',
    message: 'project name:',
    validate (val) {
      return true;
    }
  },
  {
    type: 'input',
    name: 'template',
    message: 'project template:',
    validate (val) {
      return true;
    }
  }
]

module.exports = prompt(question).then(({name, template}) => {
  const projectName = name.trim() === '' ? 'livenode' : name;
  let templateName = typeof template.trim() === '' ? 'init' : template;
  templateName = tplList[templateName] === undefined ? 'init' : template.trim();
  const gitPlace = tplList[templateName]['place'];
  const gitBranch = tplList[templateName]['branch'];
  const spinner = ora('Downloading please wait...');
  spinner.start();
  download(`${gitPlace}${gitBranch}`, `./${projectName}`, (err) => {
    if (err) {
      console.log(chalk.red(err))
      process.exit()
    }
    fs.readFile(`./${projectName}/package.json`, 'utf8', function (err, data) {
      if(err) {
        spinner.stop();
        console.error(err);
        return;
      }
      const packageJson = JSON.parse(data);
      packageJson.scripts.start = `pm2 start build/dev-server.js --name='${projectName}'`;
      packageJson.scripts.build = `pm2 start build/build.js -i max --watch --name='${projectName}`;
      packageJson.scripts.restart = `pm2 restart ${projectName}`;
      packageJson.scripts.stop = `pm2 stop ${projectName}`;
      var updatePackageJson = JSON.stringify(packageJson, null, 2);
      fs.writeFile(`./${projectName}/package.json`, updatePackageJson, 'utf8', function (err) {
        if(err) {
          spinner.stop();
          console.error(err);
          return;
        } else {
          spinner.stop();
          console.log(chalk.green('project init successfully!'))
          console.log(`
            ${chalk.bgWhite.black('   Run Application  ')}
            ${chalk.yellow(`cd ${projectName}`)}
            ${chalk.yellow('npm install')}
            ${chalk.yellow('npm start')}
          `);
        }
      });
    });
  })
})
