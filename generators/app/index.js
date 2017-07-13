const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('babel')
  }

  initializing() {
    this.log('Initializing');
  }

  prompting() {
    return this.prompt([
      this._askProjectName(),
      this._askReactVersion(),
      this._askReduxVersion()
    ])
    .then(answers => {
      this._reactVersion = answers.reactVersion;
      this._reduxVersion = answers.reduxVersion;
      this._projectName = answers.projectName;
    });
  }

  configuring() {
    this.log('configuring');
  }

  async asyncTask() {
    this.log('asyncTask');

    await new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('async done');
        resolve();
      }, 2000);
    })
  }

  defaultMethod() {
    this.log('defaultMethod');
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('package.tpl'),
      this.destinationPath('package.json'),
      { name: this._projectName }
    );
  }

  install() {
    this.npmInstall([`react@${this._reactVersion}`], { 'save': true });
    this.npmInstall(['redux'], { 'save': true });
  }

  end() {
    this.log(`React Version: ${this._reactVersion}`);
    this.log(`Redux Version: ${this._reduxVersion}`);
  }

  _askProjectName() {
    return {
      type: 'input',
      name: 'projectName',
      message: 'What is the name of the project'
    };
  }

  _askReactVersion() {
    return {
      type: 'input',
      name: 'reactVersion',
      message: 'What version of React would you like to use',
      default: '15'
    };
  }

  _askReduxVersion() {
    return {
      type: 'input',
      name: 'reduxVersion',
      message: 'What version of Redux would you like to use',
      default: '2.0.0'
    };
  }
}
