export default class PhotoExportController {
    constructor($scope, $uibModal) {
        'ngInject';

        this.modal = $uibModal;
    }

    openModal() {
        this.modal.open({
            animation: true,
            templateUrl: 'app/components/photo-export/photo-export-modal.html',
            controller: 'PhotoExportModalController as vm',
            size: 'lg'
        });
    }
}
