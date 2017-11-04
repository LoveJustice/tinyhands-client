
export default function ($transitions, $q, $state, toastr, SessionService) {
    'ngInject';

    $transitions.onBefore({}, transition => {
        return SatisfiesLoginRequired($q, toastr, SessionService, transition);
    });
    
    $transitions.onBefore({}, transition => {
        return SatisfiesPermissionsRequired($q, toastr, SessionService, transition);
    });
}


export const SatisfiesPermissionsRequired = ($q, toastr, SessionService, transition) => {
    let toState = transition.to();
    let returnValue = transition.from().name !== 'login' ? false : transition.router.stateService.target('dashboard'); // send them to dash if already on login page
    
    if (angular.isDefined(toState.data) && angular.isDefined(toState.data.permissions_required)) {
        let permissions = toState.data.permissions_required;
        return SessionService.me().then((result) => {
            if (permissions.some(p => !result[p])) {
                toastr.error(`You are not authorized to view that page!`);
                return returnValue;
            }
        });
    }
};


export const SatisfiesLoginRequired = ($q, toastr, SessionService, transition) => {
    let toState = transition.to();

    if (angular.isDefined(toState.data) && angular.isDefined(toState.data.loginNotRequired) && !toState.loginNotRequired) {
        return true;
    }

    return SessionService.checkIfAuthenticated().then(
        () => {}, 
        () => {
            return transition.router.stateService.target('login', {returnState: toState.name, params: $.param(transition.params())});
        }
    );
};