import sharedModule from '../shared/shared.module';
import GospelVerificationCommonModule from './common/gospelVerification.common.module';

import GospelVerificationRoutes from './gospelVerification.route';
import GospelVerificationService from './gospelVerification.service';
import GospelVerificationListController from './list/gospelVerificationList.controller';
import GospelVerificationListService from './list/gospelVerificationList.service';

export default angular.module('tinyhands.gospelVerification', [, sharedModule, GospelVerificationCommonModule])
    .config(GospelVerificationRoutes)
    .controller('GospelVerificationListController', GospelVerificationListController)
    .service('GospelVerificationListService', GospelVerificationListService)
    .service('GospelVerificationService', GospelVerificationService)
    .name;