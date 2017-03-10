import './index.less';

function routerConfig($urlRouterProvider) {
    'ngInject';

    $urlRouterProvider.otherwise('/');
}

export default routerConfig;
