import BaseService from '../base.service';

class Address2EditModalController extends BaseService {
    constructor($uibModalInstance, $http, address, $scope){
        'ngInject';
        super($http);

        this.modalInstance = $uibModalInstance;
        this.http = $http;
        this.scope = $scope;
        this.scope.address = angular.copy(address);
    }


    save (){
        // this is so we can save null cannon names
        if(this.scope.address.cannonical_name === "" || this.scope.address.cannonical_name == undefined || this.scope.address.cannonical_name == null){
            this.scope.address.cannonical_name = {id: -1, name: "Empty"};
        }
        this.modalInstance.close(this.scope.address);
    }

    cancel (){
        this.modalInstance.dismiss('close');
    }

    getFuzzyAddress1s (val) {
        return super.get('api/address1/fuzzy/?district=' + val)
            .then(function(response){
                return response.data;
            });
    }

    getFuzzyAddress2s (val) {
        return super.get('api/address2/fuzzy/?vdc=' + val)
            .then(function(response){
                return response.data;
            });
    }
}

export default Address2EditModalController;
