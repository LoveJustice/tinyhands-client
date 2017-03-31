
// var paths = require('./.yo-rc.json')['generator-gulp-angular'].props.paths;

// // An example configuration file.
// exports.config = {
//   // The address of a running selenium server.
//   //seleniumAddress: 'http://localhost:4444/wd/hub',
//   //seleniumServerJar: deprecated, this should be set on node_modules/protractor/config.json

//   // Capabilities to be passed to the webdriver instance.
  // capabilities: {
  //   'browserName': 'chrome'
  // },

//   baseUrl: 'http://localhost:3000',

//   // Spec patterns are relative to the current working directly when
//   // protractor is called.
//   specs: [paths.e2e + '/**/*.js'],

//   // Options to be passed to Jasmine-node.
//   jasmineNodeOpts: {
//     showColors: true,
//     defaultTimeoutInterval: 30000
//   }
// };
// conf.js
exports.config = {
  framework: 'jasmine',
  seleniumAddress: ' http://127.0.0.1:4444/wd/hub',
  baseUrl: 'http://localhost:3000',
  specs: [
    // 'spec.js',
    'e2e/border-station/borderStation.spec.js',
  ]
  ,
    capabilities: {
    'browserName': 'chrome'
  },
}