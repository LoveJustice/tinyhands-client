import CheckBoxController from './checkBox.controller';

export default class CheckBoxDirective {
  constructor() {
    'ngInject';

    let directive = {
      controller: CheckBoxController,
      controllerAs: 'checkBoxCtrl',
      link: (scope, element, attrs) => {
        scope.isFlag = 'flag' in attrs;
        scope.isAnswer = 'answer' in attrs;
      },
      require: 'ngModel',
      restrict: 'E',
      scope: {
        ngModel: '=',
        number: '='
      },
      templateUrl: 'app/irf/form/components/checkBox/checkBox.html',
      transclude: true
    };

    return directive;
  }
}