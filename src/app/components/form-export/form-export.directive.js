import formExportTemplate from './form-export.html';

export default function FormExportDirective() {
    'ngInject';

    let directive = {
	    scope: {
	        formType: '@',
	        countryList: '=',
	    },
        restrict: 'E',
        templateUrl: formExportTemplate,
        controller: 'FormExportController',
        controllerAs: 'formCtrl',
        transclude: true
    };

    return directive;
}
