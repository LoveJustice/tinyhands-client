function httpProviderConfig($httpProvider, $resourceProvider) {
    'ngInject';

    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $resourceProvider.defaults.stripTrailingSlashes = false;
}

export default httpProviderConfig;
