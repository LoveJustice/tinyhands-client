export default class GreenLightDirective {
  constructor() {
    'ngInject';

    let directive = {
      restrict: 'E',
      template: '<div><img src="http://edwards.cse.taylor.edu/static/images/green-light.png"> <span class="text-success" ng-transclude></span></div>',
      transclude: true
    };

    return directive;
  }
}