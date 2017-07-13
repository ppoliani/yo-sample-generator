const Generator = require('yeoman-generator');

class FEGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('babel')
  }

  method1() {
    this.log('method 1 run');
  }

  method2() {
    this.log('method 2 run');
  }
};


module.exports = Generator;
