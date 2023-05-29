import sharedModule from '../shared/shared.module';


import ProjectRequestRoutes from './projectRequest.route';
import ProjectRequestService from './projectRequest.service';

import ProjectRequestListController from './list/ProjectRequestList.controller';
import InputProjectRequestController from './inputProjectRequests.controller';
import ReviewProjectRequestController from './reviewProjectRequest.controller';

/* global angular */

export default angular.module('tinyhands.ProjectRequest', [ sharedModule])
    .config(ProjectRequestRoutes)
    .controller('ProjectRequestListController', ProjectRequestListController)
    .controller('InputProjectRequestController', InputProjectRequestController)
    .controller('ReviewProjectRequestController', ReviewProjectRequestController)
    .service('ProjectRequestService', ProjectRequestService)
    .name;
