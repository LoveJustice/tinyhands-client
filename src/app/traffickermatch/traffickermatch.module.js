import uiRouter from 'angular-ui-router';
import sharedModule from '../shared/shared.module';

import traffickermatchRouteConfig from './traffickermatch.route';

import TraffickerMatchController from './traffickermatch.controller';

import TraffickerMatchService from './traffickermatch.service';

export default angular.module('tinyhands.TraffickerMatch', [uiRouter, sharedModule])
    .config(traffickermatchRouteConfig)

    .controller('TraffickerMatchController', TraffickerMatchController)
    .service('traffickerMatchService', TraffickerMatchService)
    .name;