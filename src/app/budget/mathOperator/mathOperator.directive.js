import mathOperatorTemplate from './mathOperator.html?url';

export default function MathOperatorDirective() {
    'ngInject';

    let directive = {
        link: (scope, elem, attrs) => {
            let elClass = 'col-md-';
            if (attrs.width) {
                $('.operator-text').addClass(elClass + attrs.width);
            } else {
                $('.operator-text').addClass(`${elClass}1`);
            }
        },
        restrict: 'E',
        templateUrl: mathOperatorTemplate,
        transclude: true
    };

    return directive;
}