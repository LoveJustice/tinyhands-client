export default function GreenLightDirective() {
    'ngInject';

    let directive = {
      restrict: 'E',
      template: '<div><img src="/static/images/green-light.png"> <span class="text-success" ng-transclude></span></div>',
      transclude: true
    };

    return directive;
}
