import uiRouter from 'angular-ui-router';
import sharedModule from '../shared/shared.module';

import budgetRouteConfig from './budget.route';

import BudgetController from './form/budget.controller';
import BudgetListController from './list/budgetList.controller';
import MdfController from './mdf/mdf.controller';

import MathOperator from './mathOperator/mathOperator.directive';

import BudgetListService from './list/budgetList.service';
import BudgetService from './form/budget.service';

export default angular.module('tinyhands.Budget', [uiRouter, sharedModule])
    .config(budgetRouteConfig)

    .controller('BudgetController', BudgetController)
    .controller('BudgetListController', BudgetListController)
    .controller('MdfController', MdfController)

    .directive('operator', MathOperator)

    .service('BudgetListService', BudgetListService)
    .service('BudgetService', BudgetService)
    .name;
