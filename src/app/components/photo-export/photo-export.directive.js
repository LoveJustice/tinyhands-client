import photoExportTemplate from './photo-export.html?url';

export default function PhotoExportDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: photoExportTemplate,
        controller: 'PhotoExportController',
        controllerAs: 'photoCtrl'
    };

    return directive;
}
