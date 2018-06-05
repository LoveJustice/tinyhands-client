import autocompleteTemplate from './autocomplete-address2.html';

export default function AutocompleteAddress2Directive() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: autocompleteTemplate,
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
        this.loadingAddress2 = true;
        return this.address2Service.getFuzzyAddress2s(val)
            .then((promise) => {
                this.loadingAddress2 = false;
                return promise.data;
            }, () => this.loadingAddress2 = false);
    }
}