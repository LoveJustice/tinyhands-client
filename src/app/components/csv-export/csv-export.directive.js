import CsvExportController from './csv-export.controller';

export default function CsvExportDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: 'app/components/csv-export/csv-export.html',
        controller: CsvExportController,
        controllerAs: 'exportCtrl',
        scope: {
            type: '@',
            buttontext: '@'
        }
    };

    return directive;
}
