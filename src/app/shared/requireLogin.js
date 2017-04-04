export default function ($q, $state, SessionService) {
    'ngInject';
	let defer = $q.defer();
	SessionService.checkIfAuthenticated().then(() => {
		defer.resolve();
	}, () => {
		$state.go('login');
		defer.reject();
	});
	return defer.promise;
}