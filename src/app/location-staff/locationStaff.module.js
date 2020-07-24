import sharedModule from '../shared/shared.module';

import LocationStaffController from './locationStaff.controller';
import LocationStaffRoutes from './locationStaff.route';
import LocationStaffService from './locationStaff.service';

/* global angular */

export default angular.module('tinyhands.LocationStaff', [sharedModule])
    .config(LocationStaffRoutes)
    .controller('LocationStaffController', LocationStaffController)
    .service('locationStaffService', LocationStaffService)
    .name;