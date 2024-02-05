import sharedModule from '../shared/shared.module';

import personManagementRouteConfig from './personManagement.route';

import PersonManagementController from './personManagement.controller';
import PersonManagementService from './personManagement.service';
import PersonManagementListController from './list/personManagementList.controller';
import PersonManagementListService from './list/personManagementList.service';
import PersonManagementPendingListController from './pending-list/personManagementPendingList.controller';
import PersonManagementPendingListService from './pending-list/personManagementPendingList.service';
import FaceMatchingController from './face-matching/faceMatching.controller';
import FaceMatchingService from './face-matching/faceMatching.service';
import FaceMatchingResultsController from './face-matching/matching-results/faceMatchingResults.controller';
import FaceMatchingResultsService from './face-matching/matching-results/faceMatchingResults.service';

export default angular.module('tinyhands.PersonManagement', [sharedModule])
    .config(personManagementRouteConfig)

    .controller('PersonManagementController', PersonManagementController)
    .service('personManagementService', PersonManagementService)
    .controller('PersonManagementListController', PersonManagementListController)
    .service('personManagementListService', PersonManagementListService)
    .controller('PersonManagementPendingListController', PersonManagementPendingListController)
    .service('personManagementPendingListService', PersonManagementPendingListService)
    .controller('FaceMatchingResultsController', FaceMatchingResultsController)
    .service('faceMatchingResultsService', FaceMatchingResultsService)
    .controller('FaceMatchingController', FaceMatchingController)
    .service('faceMatchingService', FaceMatchingService).name;
