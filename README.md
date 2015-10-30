# JS Build Automation System
Automating all-staged application developing, testing, building, deploying process

## Prerequisite
- Node
- npm

## Usage
- Run `$ git submodule add git@dev.bondcompro.com:Marcus_Hsu/js-build-automating-system.git`
- (Optional) If testing in development environment, Check out development branch by run `$ git checkout develop` in `js-build-automating-system/` directory
- Run `$ npm install .` in `js-build-automating-system/` directory (if encounter any error, try to run $ npm install . --production again until no error)
- Run `$ npm start`

## Technology

* [Grunt] (http://gruntjs.com/)
* [JSCS] (http://jscs.info/)
* [JSHint] (http://jshint.com/)

***[Note] All required packages and versions are listed in `bower.json` for front-end side and `package.json` for back-end side***