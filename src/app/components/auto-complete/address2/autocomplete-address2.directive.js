export default function AutocompleteAddress2Directive() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: 'app/components/auto-complete/address2/autocomplete-address2.html',
        controller: AutocompleteAddress2Controller,
        controllerAs: 'acAddress2Ctrl',
        scope: {
            label: '=?',
            ngModel: '=',
        }
    };

    return directive;
}

class AutocompleteAddress2Controller {
    constructor($scope, address2Service) {
        'ngInject';
        this.address2Service = address2Service;
        this.label = $scope.label;
    }

    getFuzzyAddress2s(val) {
        return this.address2Service.getFuzzyAddress2s(val)
            .then((promise) => {
                return promise.data;
            });
    }
}
