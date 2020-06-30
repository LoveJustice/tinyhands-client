import sharedModule from '../shared/shared.module';

import personManagementRouteConfig from './personManagement.route';

import PersonManagementController from './personManagement.controller';
import PersonManagementService from './personManagement.service';
import PersonManagementListController from './list/personManagementList.controller';
import PersonManagementListService from './list/personManagementList.service';

export default angular.module('tinyhands.PersonManagement', [sharedModule])
    .config(personManagementRouteConfig)

    .controller('PersonManagementController', PersonManagementController)
    .service('personManagementService', PersonManagementService)
    .controller('PersonManagementListController', PersonManagementListController)
    .service('personManagementListService', PersonManagementListService)
    .name;