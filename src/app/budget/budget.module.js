import sharedModule from '../shared/shared.module';

import budgetRouteConfig from './budget.route';

import BudgetController from './form/budget.controller';
import BudgetListController from './list/budgetList.controller';
import CreateBudgetModalController from './list/createBudgetModal.controller';
import MdfController from './mdf/mdf.controller';

import MathOperator from './mathOperator/mathOperator.directive';

import BudgetListService from './list/budgetList.service';
import BudgetService from './form/budget.service';

export default angular.module('tinyhands.Budget', [sharedModule])
    .config(budgetRouteConfig)

    .controller('BudgetController', BudgetController)
    .controller('BudgetListController', BudgetListController)
    .controller('MdfController', MdfController)
    .controller('CreateBudgetModalController', CreateBudgetModalController)

    .directive('operator', MathOperator)

    .service('BudgetListService', BudgetListService)
    .service('BudgetService', BudgetService)
    .name;
