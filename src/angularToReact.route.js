import { TOP_LEVEL_REACT_PAGES } from './ReactRouter';

export default function angularToReactRouterConfig($stateProvider, $urlRouterProvider) {
    'ngInject';

    // So we can make buttons to react things the 'angular way'
    TOP_LEVEL_REACT_PAGES
      // Remove angular fallback route
      .filter((page) => !page.index)
      .forEach((page) => {
        $stateProvider
        .state(page.id, {
            url: page.path,
            onEnter: function() {
                location.replace(page.path)
            }
        })
    });

    $urlRouterProvider.otherwise('/');
}
