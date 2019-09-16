import sharedModule from '../shared/shared.module';

import IndicatorsController from './indicators.controller';
import IndicatorsRoutes from './indicators.route';
import IndicatorsService from './indicators.service';
import CountriessService from '../countries/countries.service';

/* global angular */

export default angular.module('tinyhands.Indicators', [sharedModule])
    .config(IndicatorsRoutes)
    .controller('IndicatorsController', IndicatorsController)
    .service('indicatorsService', IndicatorsService)
    .service('contriesService', CountriessService)
    .name;