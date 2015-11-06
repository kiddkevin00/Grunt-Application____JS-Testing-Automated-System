# JS Build Automation System
Automating all-staged application developing, testing, building, deploying process

## Prerequisite
- Node.js
- npm

## Usage
- Run `$ git submodule add git@github.com:kiddkevin00/Grunt-Application____JS-Testing-Automated-System.git` in your testing project root directory
- (Optional) If you want to test in development environment, check out development branch by run `$ git checkout develop` in `js-build-automating-system/` directory
- Run `$ npm install .` in `js-build-automating-system/` directory as an administrator (if encounter any error, try to run `$ npm install .` again until no error)
- Run `$ npm start` in `js-build-automating-system/` directory
- Check out all the results in `js-build-automating-system/reporter` directory, and enjoy the live-reload feature when correcting your codes

## Technology

* [Grunt] (http://gruntjs.com/)
* [JSCS] (http://jscs.info/)
* [JSHint] (http://jshint.com/)

***[Note] All required packages and versions are listed in `bower.json` for front-end side and `package.json` for back-end side***
