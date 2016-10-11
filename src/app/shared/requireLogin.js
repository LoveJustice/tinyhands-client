export default function($q, $state, $timeout, SessionService) {
  let defer = $q.defer();
  SessionService.checkIfAuthenticated().then(() => {
    defer.resolve();
  }, () => {
    $timeout(() => {
      $state.go('login');
    });
    defer.reject();
  });
  return defer.promise;
};