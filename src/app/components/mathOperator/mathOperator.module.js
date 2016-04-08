import SharedModule from '../../shared/shared.module';

import MathOperator from './mathOperator.directive';

export default angular.module('tinyhands.MathOperator', ['ui.router', 'tinyhands.Shared'])
    .directive('operator', () => new MathOperator());