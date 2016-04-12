export default class AnswerDirective {
  constructor() {
    'ngInject';

    let directive = {
      require: 'ngModel',
      restrict: 'E',
      scope: {
        ngModel: '=',
        number: '='
      },
      templateUrl: 'app/components/answer/answer.html',
      transclude: true
    };

    return directive;
  }
}