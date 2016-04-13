export default function MathOperatorDirective() {
  'ngInject';

  let directive = {
    link: (scope, elem, attrs) => {
      let elClass = 'col-md-';
      if (attrs.width) {
        angular.element('.operator-text').addClass(elClass + attrs.width);
      } else {
        angular.element('.operator-text').addClass(`${elClass}1`);
      }
    },
    restrict: 'E',
    templateUrl: 'app/components/mathOperator/mathOperator.html',
    transclude: true
  };

  return directive;
}