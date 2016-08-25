export default function PhotoExportDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: 'app/components/photo-export/photo-export.html',
        controller: 'PhotoExportController',
        controllerAs: 'photoCtrl'
    };

    return directive;
}
