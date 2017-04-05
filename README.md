# Tiny Hands Dreamsuite

### Codeship Status
[ ![Codeship Status for tu-software-studio/tinyhands-client](https://codeship.com/projects/be6ab140-e41a-0133-4db8-3aa3f222b1f1/status?branch=develop)](https://codeship.com/projects/146238)

### Front-End Setup
1. Have [npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm) installed on your machine
2. Install dependencies: `npm install`
3. `npm run dev` will start the local server and launch the application in your browser

--------------------
### Developing
**Important Note:** the URLs for the rest endpoints when developing, on staging, or master are in [`webpack.config.js`](webpack.config.js).  

--------------------
#### Local Development
`npm run dev` 	  -> Runs the website locally and automatically reloads when files are changed

#### Unit Testing
`npm run test`	  -> To run unit tests  

#### Building
`npm run local`   -> Bundles project for local environment
`npm run stage`    -> Bundles project for staging environment  
`npm run prod`    -> Bundles project for production environment  

--------------------
### Frameworks Used
[AngularJS](https://angularjs.org/) JS Framework  
**UI**  
[Angular UI Bootstrap](http://angular-ui.github.io/bootstrap/) UI Framework  
[Bootstrap](http://getbootstrap.com/) UI Framework  
[ngInfiniteScroll](https://sroze.github.io/ngInfiniteScroll/) Third-party tool for running functions when scrolling  
[Less CSS](http://lesscss.org/) CSS Language  
**Testing**  
[Jasmine](http://jasmine.github.io/) JS Unit testing  
[Karma](http://karma-runner.github.io/) JS Unit testing  
[Protractor](https://github.com/angular/protractor) E2E Testing  
**Building/Compiling**  
[ES6 Babel](https://babeljs.io/) ES6to5 Transpiler  
[Webpack 2](https://webpack.js.org/)
