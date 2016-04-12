export default class VerticalWordDirective {
  constructor() {
    'ngInject';

    let directive = {
      link: (scope, elem) => {
        elem.html(elem.html().split('').join('<br/>'));
      },
      restrict: 'E'
    };

    return directive;
  }
}