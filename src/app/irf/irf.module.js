import IRFRoutes from './irf.route';

import CheckBoxDirective from './form/components/checkBox/checkBox.directive';
import GreenLightDirective from './form/components/greenLight/greenLight.directive';
import VerticalWordDirective from './form/components/verticalWord/verticalWord.directive';

import IrfListService from './list/irfList.service';
import IrfService from './form/irf.service';

import IrfListController from './list/irfList.controller';
import IrfController from './form/irf.controller';

export default angular.module('tinyhands.IRF', ['ui.router', 'tinyhands.Shared'])
    .config(IRFRoutes)
    
    .directive('checkBox', CheckBoxDirective)
    .directive('greenLight', GreenLightDirective)
    .directive('verticalWord', VerticalWordDirective)
    
    .service('IrfListService', IrfListService)
    .service('IrfService', IrfService)
    
    .controller('IrfListController', IrfListController)
    .controller('IrfController', IrfController);

    