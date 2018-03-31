const {prompt} = require('inquirer')
const chalk = require('chalk')
const download = require('download-git-repo')
const ora = require('ora')

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
    spinner.stop()
    console.log(chalk.green('project init successfully!'))
  })
})
