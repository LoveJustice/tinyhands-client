import DetailController from './detail.controller';

export default function DetailDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: 'app/border-station/detail/detail.html',
        controller: DetailController,
        controllerAs: 'detailCtrl'
    };

    return directive;
}