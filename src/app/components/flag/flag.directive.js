export default class FlagDirective {
  constructor() {
    'ngInject';

    let directive = {
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