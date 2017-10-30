import exportMdfTemplate from './mdf-export.html';
import mdfExportModalTemplate from './mdf-export-modal.html';
import constants from '../../constants.js';

class ExportMdfsModalController {
    constructor($uibModalInstance, $window, BaseService) {
        'ngInject';
        this.uibModalInstance = $uibModalInstance;
        this.window = $window;
        this.service = BaseService;

        this.months = [
            {name: "January", value: 1},
            {name: "February", value: 2},
            {name: "March", value: 3},
            {name: "April", value: 4},
            {name: "May", value: 5},
            {name: "June", value: 6},
            {name: "July", value: 7},
            {name: "August", value: 8},
            {name: "September", value: 9},
            {name: "October", value: 10},
            {name: "November", value: 11},
            {name: "December", value: 12},
        ];
        let currentDate = new Date();

        this.selectedMonth = currentDate.getMonth();
        this.selectedYear = currentDate.getFullYear();
        this.getNumberOfMdfs();
    }

    exportPhotos() {
        let url = constants.BaseUrl + `api/mdf/${this.selectedMonth}/${this.selectedYear}/pdf`;
        this.window.open(url, '_blank');
    }

    getNumberOfMdfs() {
        this.service.get(`api/mdf/${this.selectedMonth}/${this.selectedYear}/count/`).then((promise) => {
            this.numberOfMdfs = promise.data.count;
        });
    }

    validate() {
        if (this.numberOfMdfs) {
            return true;
        }
        return false;
    }
}

class ExportMdfsController {
    constructor($uibModal) {
        'ngInject';
        this.modal = $uibModal;
    }

    openModal() {
        this.modal.open({
            animation: true,
            templateUrl: mdfExportModalTemplate,
            controller: ExportMdfsModalController,
            controllerAs: "vm",
            size: 'md'
        });
    }
}

const CreateButtonComponent = {
  templateUrl: exportMdfTemplate,
  controller: ExportMdfsController,
};

export default CreateButtonComponent;