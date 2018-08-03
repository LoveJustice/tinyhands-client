import FormController from './form.controller';
import formTemplate from './form.html';

export default function FormDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: formTemplate,
        controller: FormController,
        controllerAs: 'frmCtrl'
    };

    return directive;
}