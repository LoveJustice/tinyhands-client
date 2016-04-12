import FlagController from './flag.controller';

export default class FlagDirective {
  constructor() {
    'ngInject';

    let directive = {
      controller: FlagController,
      controllerAs: 'flagCtrl',
      require: 'ngModel',
      restrict: 'E',
      scope: {
        ngModel: '=',
        number: '='
      },
      templateUrl: 'app/components/flag/flag.html',
      transclude: true
    };

    return directive;
  }
}