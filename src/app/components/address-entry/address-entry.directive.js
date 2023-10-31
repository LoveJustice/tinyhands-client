import addressEntryTemplate from './address-entry.html?url';
import SearchAddressController from './searchAddressController.js';
import searchAddressTemplate from './searchAddress.html?url';
import './address-entry.less';

export default function AddressEntryDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: addressEntryTemplate,
        controller: AddressEntryController,
        controllerAs: 'addressEntryController',
        scope: {
            label: '=?',
            ngModel: '=',
            latitudeModel: '=',
            longitudeModel: '=',
            viewOnly: '=',
            hideText: '=?'
        }
    };

    return directive;
}

class AddressEntryController {
    constructor($scope, $uibModal) {
        'ngInject';
        this.label = $scope.label;
        this.$scope = $scope;
        this.$uibModal = $uibModal;
        this.hideText = $scope.hideText;
        this.addressString = '';
        if ($scope.ngModel && $scope.ngModel.address) {
            this.addressString = $scope.ngModel.address;
        } else {
            this.addressString = '';
        }
    }
    
    searchAddress() {
        this.$uibModal.open({
            bindToController: true,
            controller: SearchAddressController,
            controllerAs: 'vm',
            resolve: {
                address: () => this.$scope.ngModel,
                viewOnly: () => this.$scope.viewOnly,
            },
            size: 'lg',
            templateUrl: searchAddressTemplate,
        }).result.then((address) => {
            this.$scope.ngModel = address;
            if (address && address.location && address.location.y) {
                this.$scope.latitudeModel = address.location.y;
            }
            if (address && address.location && address.location.x) {
                this.$scope.longitudeModel = address.location.x;
            }
            if (this.$scope.ngModel && this.$scope.ngModel.address) {
                this.addressString = this.$scope.ngModel.address;
            } else {
                this.addressString = '';
            }
        });
    }
}