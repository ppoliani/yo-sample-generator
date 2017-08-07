const Generator = require('yeoman-generator');
const rimraf = require('rimraf');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('babel')
  }

  prompting() {
    return this.prompt([
      this._askProjectName(),
      this._askAppType()
    ])
    .then(answers => {
      this._projectName = answers.projectName;
      this._isCWA = answers.isCWA;
    });
  }

  clone() {
    try {
      this.log('Cloning the project...');
      this.spawnCommandSync('git', ['clone', 'git@gitlab.com:ppoliani/react-redux-boilerplate.git', `${this._projectName}`]);
      this.log('Project cloned successfully');
    }
    catch(error) {
      this._clean(error);
    }
  }


  writing() {
    this.log('Copying templates...');
    this.fs.copyTpl(
      this.destinationPath(`./${this._projectName}/package.json`),
      this.destinationPath(`./${this._projectName}/package.json`),
      {name: this._projectName}
    );
  }

  install() {
    this.destinationRoot(`./${this._projectName}`);
    this.log('Installing dependencies...');
    this.installDependencies({
      npm: true,
      bower: false,
      callback: err => {
        if(err) return this._clean(err);
        this.log('Dependencies installed successuflly');
      }
    });
  }

  gitInit() {
    this.log('Git init...');
    rimraf(`./${this._projectName}/.git`, error => {
      if(error) return this._clean(error);
      this.spawnCommandSync('git', ['init', `${this._projectName}`]);
    })
  }

  end() {
    this.log('Finished!');
  }

  _clean(err) {
    this.log('Cleaning directory...');
    rimraf(`${this._projectName}`, error => {
      if(error) throw err;
      this.log('Clean Succeeded...');
    });
  }

  _askProjectName() {
    return {
      type: 'input',
      name: 'projectName',
      message: 'What is the name of the project:'
    };
  }

  _askAppType() {
     return {
      type: 'input',
      name: 'isCWA',
      message: 'Is this a CWA project (n/y):',
      default: 'Y'
    };
  }
}
