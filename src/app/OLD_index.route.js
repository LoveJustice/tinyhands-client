import './index.less';
import './helpers.less';

function routerConfig($urlRouterProvider) {
    'ngInject';

    $urlRouterProvider.otherwise('/');
}

export default routerConfig;