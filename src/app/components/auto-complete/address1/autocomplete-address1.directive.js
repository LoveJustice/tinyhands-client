export default function AutocompleteAddress1Directive() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: 'app/components/auto-complete/address1/autocomplete-address1.html',
        controller: AutocompleteAddress1Controller,
        controllerAs: 'acAddress1Ctrl',
        scope: {
            label: '=?',
            ngModel: '=',
        }
    };

    return directive;
}

class AutocompleteAddress1Controller {
    constructor($scope, address1Service) {
        'ngInject';
        this.address1Service = address1Service;
        this.label = $scope.label;
    }

    getFuzzyAddress1s(val) {
        return this.address1Service.getFuzzyAddress1s(val)
            .then((promise) => {
                return promise.data;
            });
    }
}
