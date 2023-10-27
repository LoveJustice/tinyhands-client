import SimpleAngularPage from './SimpleAngularPage.component';
import SimpleAngularRouteConfig from './simpleAngularRoute.route';

const simpleAngularModule = angular.module('tinyhands.simpleAngularPage', [])
    .config(SimpleAngularRouteConfig)
    .component('simpleAngularPage', SimpleAngularPage)
    .name;

export default simpleAngularModule;