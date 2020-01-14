import sharedModule from '../shared/shared.module';

import CollectionIndicatorsController from './collectionIndicators.controller';
import CollectionIndicatorsRoutes from './collectionIndicators.route';
import CollectionIndicatorsService from './collectionIndicators.service';

/* global angular */

export default angular.module('tinyhands.CollectionIndicators', [sharedModule])
    .config(CollectionIndicatorsRoutes)
    .controller('CollectionIndicatorsController', CollectionIndicatorsController)
    .service('collectionIndicatorsService', CollectionIndicatorsService)
    .name;