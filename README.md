# Tiny Hands Dreamsuite

**Note:** Used [Generator-gulp-angular](https://github.com/Swiip/generator-gulp-angular) to generate project

### Front-End Installation
1. `npm install -g gulp bower`
2. Install dependencies: `npm install`
3. Install more dependencies: `bower install`

#### Troubleshooting Installation
- If `npm install -g` fails because of permission errors (it's most likely trying to install in `/usr/local`), run the following commands. This makes it so the global (`-g`) node packages are installed on your home directory instead of attempting to install it for the whole computer:
  1. `echo 'prefix = ${HOME}/.npm-packages' >> ~/.npmrc`
  2. `echo 'export PATH="$HOME/.npm-packages/bin:$PATH"' >> ~/.bashrc`

--------------------
### Gulp Usage
#### Running
`gulp serve` 	  -> To run the project and watch file changes run  
`gulp serve:dist` -> To build the project, run the project and watch file changes run

#### Unit Testing
`gulp test`			  -> To run Karma tests  
`gulp test:auto`	  -> To run Karma tests and watch changes  

#### E2E Testing
**Note:** Requires `protractor.config.js` to contain paths to test files  
`webdriver-manager start` -> Must be running in a separate terminal tab before launching protractor  
`gulp protractor`		-> To run Protractor e2e tests  
`gulp protractor:src`	-> To run Protractor e2e tests from src  
`gulp protractor:dist`	-> To run Protractor e2e tests from compiled build  

#### Misc
`gulp build`	-> To Build project  
`gulp inject`	-> UNKOWN  
`gulp scripts`	-> UNKOWN  
`gulp scripts`  -> UNKOWN  
`gulp styles`	-> UNKOWN  
`gulp watch`	-> UNKOWN  

--------------------
### Frameworks Used
[AngularJS](https://angularjs.org/) JS Framework  
**UI**  
[Angular UI Bootstrap](http://angular-ui.github.io/bootstrap/) UI Framework  
[Bootstrap](http://getbootstrap.com/) UI Framework  
[Less CSS](http://lesscss.org/) CSS Language  
**Testing**  
[Jasmine](http://jasmine.github.io/) JS Unit testing  
[Karma](http://karma-runner.github.io/) JS Unit testing  
[Protractor](https://github.com/angular/protractor) E2E Testing 
[webdriver-manger](https://www.npmjs.com/package/webdriver-manager) E2E Testing
**Building/Compiling**  
[ES6 Babel](https://babeljs.io/) ES6to5 Transpiler  
[GulpJS](http://gulpjs.com/) Build System  
[BrowserSync](http://browsersync.io/) Sync browser on changes  
