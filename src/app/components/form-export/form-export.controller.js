import formExportModalTemplate from './form-export-modal.html';

export default class FormExportController {
    constructor($scope, $uibModal) {
        'ngInject';

		this.$scope = $scope;
        this.modal = $uibModal;
    }

    openModal() {
        this.modal.open({
            animation: true,
            templateUrl: formExportModalTemplate,
            controller: 'FormExportModalController as vm',
            resolve: {
                formType: () => this.$scope.formType,
                countryList: () => this.$scope.countryList
            },
            size: 'lg'
        });
    }
}
