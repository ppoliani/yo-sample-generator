const Generator = require('yeoman-generator');
const rimraf = require('rimraf');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('babel');
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
    this.spawnCommandSync('git', ['clone', 'git@gitlab.com:ppoliani/react-redux-boilerplate.git', `${this._projectName}`]);
    this.log('Project cloned successfully');
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
    this.log('Installing dependencies...');
    this.destinationRoot(`./${this._projectName}`);
    const command = this.spawnCommand('npm', ['install', '--registry http://nexus.sandbox.extranet.group/nexus/content/groups/npm-master']);
    this._gitInit();

    command.on('close', err => {
      this._clean(err);
    });
  }

  _gitInit() {
    this.log('Removing old .git...');
    rimraf(`.git`, error => {
      if(error) return this._clean(error);
      this.log('Old .git removed');
      this.log('Git init...');
      this.spawnCommandSync('git', ['init']);
      this._gitInitialCommit();
    })
  }

  _gitInitialCommit() {
    this.log('Git initial commit...');
    this.spawnCommandSync('git', ['add', '.']);
    this.spawnCommandSync('git', ['commit', '-am', 'Initial Commit']);
  }

  _clean(err) {
    this.log(`Cleaning directory...`);
    rimraf(`../${this._projectName}`, error => {
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
