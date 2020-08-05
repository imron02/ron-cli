const Generator = require('yeoman-generator');
const yosay = require('yosay');
const execSync = require('child_process').execSync;

const ProjectType = ['Init project', 'Install component'];

module.exports = class extends Generator {
  initializing() {
    this.log(yosay('Hello, and welcome to ron-cli generator!'));
  }

  async prompting() {
    const questions = [
      {
        type: 'list',
        name: 'type',
        message: 'Please choose project type',
        choices: ProjectType,
      },
      {
        type: 'input',
        name: 'name',
        message: 'Application name?',
        when: (answer) => answer.type === ProjectType[0],
      },
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Make sure you read this before continue https://reactnative.dev/docs/environment-setup',
        when: (answer) => answer.type === ProjectType[0],
      },
    ];

    this.answer = await this.prompt(questions);
  }

  writing() {
    if (this.answer.type === ProjectType[0] && this.answer.confirm) {
      execSync(`npx react-native init ${this.answer.name}`, {stdio: [0, 1, 2]});
      this.destinationRoot(this.answer.name),
      this._initPackage();
      this.fs.copy(
          this.templatePath('**/.*'),
          this.destinationRoot(),
      );
      this.fs.copy(
          this.templatePath('**/*'),
          this.destinationRoot(),
      );
    }
  }

  _initPackage() {
    const pkgJson = {
      scripts: {
        'clean:android': 'cd android && ./gradlew clean && cd ../',
        'clean:ios': 'cd ios && xcodebuild clean && cd ../',
        'postinstall': 'npx pod-install',
        'reset': 'make run-reset',
      },
      dependencies: {
        '@react-navigation/native': '^5.7.0',
        'react-native-config': '^1.3.1',
        'react-native-gesture-handler': '^1.6.1',
        'react-native-mmkv-storage': '^0.3.5',
        'react-native-paper': '^3.10.1',
        'react-native-reanimated': '^1.9.0',
        'react-native-safe-area-context': '^3.1.1',
        'react-native-screens': '^2.9.0',
        'react-redux': '^7.2.0',
        'redux': '^4.0.5',
        'redux-logger': '^3.0.6',
        'redux-persist': '^6.0.0',
        'redux-thunk': '^2.3.0',
      },
      devDependencies: {
        'husky': '^4.2.5',
      },
      husky: {
        'hooks': {
          'pre-commit': 'sh precommit-check.sh',
        },
      },
    };

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }

  install() {
    this.npmInstall();
  }

  end() {
    this.log(yosay('Bye, thanks for using ron-cli generator!'));
  }
};
