import './src/app/index.module';
import 'angular-mocks';

const context = require.context('./src/app', true, /\.spec.js$/);

context.keys().forEach(context);