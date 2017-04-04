import DetailController from './detail.controller';
import DetailTemplate from './detail.html';

export default function DetailDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: DetailTemplate,
        controller: DetailController,
        controllerAs: 'detailCtrl'
    };

    return directive;
}