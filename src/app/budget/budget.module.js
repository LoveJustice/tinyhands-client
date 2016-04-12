import SharedModule from '../shared/shared.module';

import BudgetListService from './list/budgetList.service';
import BudgetService from './form/budget.service';

import BudgetAdministrationFormController from './form/components/administration/administrationForm.controller';
import BudgetAwarenessFormController from './form/components/awareness/awarenessForm.controller';
import BudgetCommunicationFormController from './form/components/communication/communicationForm.controller';
import BudgetController from './form/budget.controller';
import BudgetFoodAndGasFormController from './form/components/foodAndGas/foodAndGasForm.controller';
import BudgetListController from './list/budgetList.controller';
import BudgetMiscellaneousFormController from './form/components/miscellaneous/miscellaneousForm.controller';
import BudgetSalariesController from './form/components/salaries/salariesForm.controller';
import BudgetShelterFormController from './form/components/shelter/shelterForm.controller';
import BudgetSuppliesFormController from './form/components/supplies/suppliesForm.controller';
import BudgetTravelFormController from './form/components/travel/travelForm.controller';

import budgetRouteConfig from './budget.route';

import MathOperator from './mathOperator/mathOperator.directive';


export default angular.module('tinyhands.Budget', ['ui.router', 'tinyhands.Shared'])
    .config(budgetRouteConfig)
    .directive('operator', () => new MathOperator())
    .service('BudgetListService', BudgetListService)
    .service('BudgetService', BudgetService)
    .controller('BudgetAdministrationFormController', BudgetAdministrationFormController)
    .controller('BudgetAwarenessFormController', BudgetAwarenessFormController)
    .controller('BudgetCommunicationFormController', BudgetCommunicationFormController)
    .controller('BudgetController', BudgetController)
    .controller('BudgetFoodAndGasFormController', BudgetFoodAndGasFormController)
    .controller('BudgetListController', BudgetListController)
    .controller('BudgetMiscellaneousFormController', BudgetMiscellaneousFormController)
    .controller('BudgetSalariesController', BudgetSalariesController)
    .controller('BudgetShelterFormController', BudgetShelterFormController)
    .controller('BudgetSuppliesFormController', BudgetSuppliesFormController)
    .controller('BudgetTravelFormController', BudgetTravelFormController);