import auditListTemplate from './list/auditList.html';
import './list/auditList.less';
import auditSampleListTemplate from './sampleList/auditSampleList.html';
import './sampleList/auditSampleList.less';
import auditTemplate from './audit.html';
import auditSampleTemplate from './auditSample.html';

function AuditRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('auditList', {
            url: '/auditList',
            params: {
            },
            templateUrl: auditListTemplate,
            controller: 'AuditListController',
            controllerAs: '$ctrl',
         })
        .state('auditSampleList', {
          url: '/auditSampleList?auditId',
          params: {
            auditId: { dynamic: true },
          },
          templateUrl: auditSampleListTemplate,
          controller: 'AuditSampleListController',
          controllerAs: '$ctrl',
        })
        .state('audit', {
            url: '/audit?id&auditId&isViewing',
            params: {
                id:null
            },
            templateUrl: auditTemplate,
            controller: 'AuditController',
            controllerAs: '$ctrl',
          })
          .state('auditSample', {
            url: '/auditSample?id&auditId',
            params: {
                id:null,
                auditId: { dynamic: true },
            },
            templateUrl: auditSampleTemplate,
            controller: 'AuditSampleController',
            controllerAs: '$ctrl',
          });
}

export default AuditRoutes;