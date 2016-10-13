import constants from '../../constants';

export default class CsvExportController {
    constructor($scope) {
        'ngInject';

        this.href = this.typeToUrl($scope.type);
        this.buttonText = $scope.buttontext;
    }

    typeToUrl(type) {
        var url;
        switch (type) {
            case 'irf':
                url = 'data-entry/irfs/export/';
                break;
            case 'vif':
                url = 'data-entry/vifs/export/';
                break;
            default:
        }
        return constants.BaseUrl + url;
    }
}
