import sharedModule from '../shared/shared.module';

import helpRouteConfig from './help.route';

import HelpController from './help.controller';
import ViewVideoController from './viewVideo.controller';


import HelpService from './help.service';

export default angular.module('tinyhands.Help', [sharedModule])
    .config(helpRouteConfig)

    .controller('HelpController', HelpController)
    .controller('ViewVideoController', ViewVideoController)
    .service('helpService', HelpService)
    .name;