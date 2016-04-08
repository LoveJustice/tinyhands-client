import SharedModule from '../../shared/shared.module';

import TallyService from './tally.service';
import TallyDirective from './tally.directive';
import TallyController from './tally.controller';

export default angular.module('tinyhands.Tally', ['ui.router', 'tinyhands.Shared'])
    .service('tallyService', TallyService)
    .directive('tally', () => new TallyDirective())
    .controller('TallyController', TallyController);