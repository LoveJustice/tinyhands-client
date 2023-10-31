import exportMdfTemplate from './mdf-export.html?url';
import mdfExportModalTemplate from './mdf-export-modal.html?url';
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
        this.selectedCountryId = null;
        this.userCountries();
    }
    
    userCountries() {
        this.service.get('api/user_permission/countries/current-user/?permission_group=BUDGETS').then((promise) => {
            this.countries = promise.data;
            if (this.countries.length === 1) {
                this.selectedCountryId = '' + this.countries[0].id;
                this.getNumberOfMdfs();
            }
        });
    }

    exportPhotos() {
        if (isNaN(this.selectedMonth) || this.selectedMonth < 1 || this.selectedMonth > 12) {
            return;
        }
        let url = constants.BaseUrl + `api/mdf/${this.selectedMonth}/${this.selectedYear}/${this.selectedCountryId}/pdf`;
        this.window.open(url, '_blank');
    }

    getNumberOfMdfs() {
        if (isNaN(this.selectedMonth) || this.selectedMonth < 1 || this.selectedMonth > 12 || this.selectedCountryId === null) {
            return;
        }
        this.service.get(`api/mdf/${this.selectedMonth}/${this.selectedYear}/${this.selectedCountryId}/count/`).then((promise) => {
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
            size: 'lg'
        });
    }
}

const CreateButtonComponent = {
  templateUrl: exportMdfTemplate,
  controller: ExportMdfsController,
};

export default CreateButtonComponent;