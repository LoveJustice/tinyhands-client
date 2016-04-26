export default function VerticalWordDirective() {
    'ngInject';

    let directive = {
      link: (scope, elem) => {
        elem.html(elem.html().split('').join('<br/>'));
      },
      restrict: 'E'
    };

    return directive;
}