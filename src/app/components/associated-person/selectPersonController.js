/* global angular */
export default class SelectPersonController {
    constructor($uibModal, $uibModalInstance, $scope, personList) {
        'ngInject';
        this.$uibModalInstance = $uibModalInstance;
        this.scope = $scope;
        this.personList = personList;
        this.selectedItem = -1;
    }
    
    select() {
        let selectedPerson = null;
        for (let idx=0; idx < this.personList.length; idx++) {
            if (Number(this.selectedItem) === this.personList[idx].storage_id) {
                selectedPerson = angular.copy(this.personList[idx]);
                selectedPerson.link_id = selectedPerson.storage_id;
                selectedPerson.storage_id = null;
                break;
            }
        }
        this.$uibModalInstance.close(selectedPerson);
    }
    
    cancel() {
        this.$uibModalInstance.dismiss();
    }
}
