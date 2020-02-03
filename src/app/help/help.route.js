import helpListTemplate from './helpList.html';
import viewVideoTemplate from './viewVideo.html';

function helpRouteConfig($stateProvider) {
    'ngInject';
    $stateProvider
        .state('helpvideo', {
            url: '/help/video',
            params: {
                search: {
                    dynamic: true
                }
            },
            templateUrl: helpListTemplate,
            controller: 'HelpController',
            controllerAs: 'vm'
        })
        .state('viewvideo', {
            url: '/help/video/view',
            params: {
                videoUrl: {
                    dynamic: true
                }
            },
            templateUrl: viewVideoTemplate,
            controller: 'ViewVideoController',
            controllerAs: 'vm'
        });
}

export default helpRouteConfig;