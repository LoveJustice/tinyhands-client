export default function CheckPermissions($rootScope, $state, SessionService) {
    $rootScope.$on('$stateChangeStart', (event, toState) => {
        let stateData = toState.data;
        if (angular.isDefined(stateData) && angular.isDefined(stateData.permissions_required)) {
            SessionService.me().then((result) => {
                stateData.permissions_required.forEach((permission) => {
                    if (!result[permission]) {
                        event.preventDefault();
                        $state.go('dashboard');
                        window.toastr.error(`You are not authorized to view the ${toState.name} page!`);
                    }
                });
            });
        }
    });
}