import constants from '../../constants';

export default class CsvExportController {
    constructor($scope, $window) {
        'ngInject';

        this.url = this.typeToUrl($scope.type);
        this.buttonText = $scope.buttontext;
        this.window = $window;
    }

    typeToUrl(type) {
        let url;
        switch (type) {
            case 'irf':
                url = 'api/irf/export/';
                break;
            case 'vif':
                url = 'api/vif/export/';
                break;
            default:
        }
        return constants.BaseUrl + url;
    }

    exportCSV() {
        this.window.open(this.url, '_blank');
    }
}
