import CsvExportController from './csv-export.controller';
import csvExportTemplate from './csv-export.html';

export default function CsvExportDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: csvExportTemplate,
        controller: CsvExportController,
        controllerAs: 'exportCtrl',
        scope: {
            buttontext: '@',
            exportServiceFunc: '&',
            getFileName: '&',
            onExportComplete: '&',
        }
    };

    return directive;
}
