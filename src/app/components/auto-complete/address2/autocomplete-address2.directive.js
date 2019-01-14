import autocompleteTemplate from './autocomplete-address2.html';
import addAddress2Template from './addAddress2.html';
import AddAddress2Controller from './addAddress2Controller.js';

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
    constructor($scope, $uibModal, address2Service) {
        'ngInject';
        this.address2Service = address2Service;
        this.label = $scope.label;
        this.$scope = $scope;
        this.typeAhead = '';
        this.$uibModal = $uibModal;
    }
    
    getFuzzyAddress2s(val) {
        this.typeAhead = val;
    	let addressName = null;
    	if (this.$scope.address1Object && this.$scope.address1Object.name) {
    		addressName = this.$scope.address1Object.name;
    	}
        return this.address2Service.getFuzzyAddress2s(val, addressName)
            .then((promise) => {
                return promise.data;
            });
    }
    
    addAddress2() {
        this.$uibModal.open({
            bindToController: true,
            controller: AddAddress2Controller,
            controllerAs: 'vm',
            resolve: {
                address1: () => this.$scope.address1Object,
                address2Name: () => this.typeAhead,
            },
            size: 'md',
            templateUrl: addAddress2Template,
        }).result.then((address) => {
            this.$scope.ngModel = address;
            this.$scope.addr2form.address2Entry.$setViewValue(address.name);
            this.$scope.addr2form.address2Entry.$render();
        });
    }
}