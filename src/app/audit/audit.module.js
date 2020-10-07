import sharedModule from '../shared/shared.module';

import AuditRoutes from './audit.route';
import AuditService from './audit.service';

import AuditListController from './list/auditList.controller';
import AuditSampleListController from './sampleList/auditSampleList.controller';
import AuditController from './audit.controller';
import AuditSampleController from './auditSample.controller';

/* global angular */

export default angular.module('tinyhands.Audit', [sharedModule])
    .config(AuditRoutes)
    .controller('AuditListController', AuditListController)
    .controller('AuditSampleListController', AuditSampleListController)
    .controller('AuditController', AuditController)
     .controller('AuditSampleController', AuditSampleController)
    .service('AuditService', AuditService)
    .name;
