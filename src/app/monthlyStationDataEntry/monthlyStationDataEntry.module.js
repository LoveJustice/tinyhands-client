import sharedModule from '../shared/shared.module';

import MonthlyStationDataEntryController from './monthlyStationDataEntry.controller';
import MonthlyStationDataEntryRoutes from './monthlyStationDataEntry.route';
import MonthlyStationDataEntryService from './monthlyStationDataEntry.service';

/* global angular */

export default angular.module('tinyhands.MonthlyStationDataEntry', [sharedModule])
    .config(MonthlyStationDataEntryRoutes)
    .controller('MonthlyStationDataEntryController', MonthlyStationDataEntryController)
    .service('monthlyStationDataEntryService', MonthlyStationDataEntryService)
    .name;