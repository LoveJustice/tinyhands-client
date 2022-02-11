import sharedModule from '../shared/shared.module';

import EmpRoutes from './emp.route';
import EmpService from './emp.service';

import EmpListController from './list/empList.controller';
import CreateEmpModalController from './list/createEmpModal.controller';

import EmpListService from './list/empList.service';
import EmpController from './emp.controller';

/* global angular */

export default angular.module('tinyhands.EMP', [sharedModule])
    .config(EmpRoutes)
    .controller('EmpListController', EmpListController)
    .controller('EmpController', EmpController)
    .service('EmpListService', EmpListService)
    .controller('CreateEmpModalController', CreateEmpModalController)
    .service('EmpService', EmpService)
    .name;
