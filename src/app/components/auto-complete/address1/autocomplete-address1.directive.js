import autocompleteTemplate from './autocomplete-address1.html';
import addAddress1Template from './addAddress1.html';
import AddAddress1Controller from './addAddress1Controller.js';

export default function AutocompleteAddress1Directive() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: autocompleteTemplate,
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
    constructor($scope, $uibModal, address1Service) {
        'ngInject';
        this.address1Service = address1Service;
        this.$uibModal = $uibModal;
        this.label = $scope.label;
        this.$scope = $scope;
        this.typeAhead = '';
    }

    getFuzzyAddress1s(val) {
    	this.typeAhead = val;
        return this.address1Service.getFuzzyAddress1s(val)
            .then((promise) => {
                return promise.data;
            });
    }
    
    addAddress1() {
    	this.$uibModal.open({
            bindToController: true,
            controller: AddAddress1Controller,
            controllerAs: 'vm',
            resolve: {
            	address1Name: () => this.typeAhead,
            },
            size: 'md',
            templateUrl: addAddress1Template,
        }).result.then((address) => {
        	this.$scope.ngModel = address;
        });
    }
}