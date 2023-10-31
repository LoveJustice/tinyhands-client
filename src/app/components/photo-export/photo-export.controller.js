import photoExportModalTemplate from './photo-export-modal.html?url';

export default class PhotoExportController {
    constructor($scope, $uibModal) {
        'ngInject';

        this.modal = $uibModal;
    }

    openModal() {
        this.modal.open({
            animation: true,
            templateUrl: photoExportModalTemplate,
            controller: 'PhotoExportModalController as vm',
            size: 'lg'
        });
    }
}
