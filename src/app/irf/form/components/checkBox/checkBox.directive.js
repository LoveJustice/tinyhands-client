import CheckBoxController from './checkBox.controller';
import checkBoxTemplate from './checkBox.html?url';

export default function CheckBoxDirective() {
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
      templateUrl: checkBoxTemplate,
      transclude: true
    };

    return directive;
}