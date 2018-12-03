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
            address1Object: "=?",
        }
    };

    return directive;
}

class AutocompleteAddress2Controller {
    constructor($scope, address2Service) {
        'ngInject';
        this.address2Service = address2Service;
        this.label = $scope.label;
        this.scope = $scope;
        this.address1Required = $scope.address1Required === true;
    }
    
    isEnabled() {
    	return this.scope.address1Name != undefined;
    }
    
    getFuzzyAddress2s(val) {
    	let addressName = null;
    	if (this.scope.address1Object && this.scope.address1Object.name) {
    		addressName = this.scope.address1Object.name;
    	}
        return this.address2Service.getFuzzyAddress2s(val, addressName)
            .then((promise) => {
                return promise.data;
            });
    }
}